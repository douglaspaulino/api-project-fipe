const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3002;
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Postgres2022@localhost:5432/projeto_fipe';

// requisições http
const axios = require('axios');

// pubsub gcp
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const subscription = pubsub.subscription('subscription_name');

const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});


app.use(bodyParser.json());


// endpoint para salvar os dados alterados do veículo no banco de dados
app.patch('/api2/veiculos/:codigo', async (req, res) => {
  const client = await pool.connect();

  const codigo = req.params.codigo;
  const { nome, observacoes } = req.body;
  const sql_modelos_update = "UPDATE MODELOS SET NOME=$2, OBSERVACOES = $3 WHERE CODIGO = $1";

  const values_modelos_update = [codigo,nome, observacoes];
  await client.query(sql_modelos_update,values_modelos_update);

  // recuperar registro alterado
  const sql_modelos_select = "SELECT * FROM MODELOS WHERE CODIGO = $1";
  const values_modelos_select = [codigo];

  const result = await client.query(sql_modelos_select, values_modelos_select)

  res.json({ data: result.rows[0], count:  result.rowCount });
});


async function consumer() {
  console.log("Ininicando consumidor");

  const client = await pool.connect();

  subscription.on('message', async message => {

    try {
      const message_received = JSON.parse(message.data.toString());
      
      const sql_marcas_insert = "INSERT INTO MARCAS (CODIGO,NOME) VALUES($1,$2) ON CONFLICT(CODIGO) where CODIGO = $1 DO UPDATE SET NOME = $2";
  
      const values_marcas_insert = [message_received.codigo, message_received.nome];
      await client.query(sql_marcas_insert,values_marcas_insert);
      console.log(": Marca inserida ==>"+message.data.toString());

      const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas/'+message_received.codigo+'/modelos');
      await response.data.modelos.forEach(async modelo => {
        
        const sql_modelos_insert = "INSERT INTO MODELOS (CODIGO,NOME,MARCA_CODIGO) VALUES($1,$2,$3) ON CONFLICT(CODIGO) where CODIGO = $1 and MARCA_CODIGO = $3  DO UPDATE SET NOME = $2, MARCA_CODIGO = $3";
        const values_modelos_insert = [modelo.codigo, modelo.nome, message_received.codigo];
        await client.query(sql_modelos_insert,values_modelos_insert);
        console.log("::: Modelo inserido ==>"+values_modelos_insert.toString());

      });


      // console.log("Iniciando processando dos modelos==> "+ JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }




    message.ack() // This deletes the message from the queue
  })
}
consumer();
app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));