const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Postgres2022@127.0.0.1:5432/projeto_fipe';

// requisições http
const axios = require('axios');

// pubsub gcp
const { PubSub } = require('@google-cloud/pubsub')
const pubsub = new PubSub();

const pool = new pg.Pool({
  connectionString: connectionString
});

pool.connect();

app.use(bodyParser.json());

// // endpoint para buscar as marcas no serviço da FIPE
// 1. Criar um serviço REST na API-1 para acionar a ”carga” dos dados de veículos.
// 2. Implementar a lógica na API-1 para buscar as "marcas" no serviço da  FIPE (https://deividfortuna.github.io/fipe/).
// 3. Configurar uma “Fila” para receber as "marcas" da API-1 e enviar uma por vez para a API-2 para processamento assíncrono.
app.get('/api1/marcas/load', async (req, res) => {
  try {
    const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const marcas = response.data;



    for (let index = 0; index < marcas.length; index++) {
      const element = marcas[index];
      console.log("enviando mensagem ==> " + JSON.stringify(element));

      const jobData = Buffer.from(JSON.stringify(element))
      await pubsub.topic('queue_bex').publish(jobData);

    }

    res.json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');

  }

});


// endpoint para buscar as marcas no banco de dados
app.get('/api1/marcas', async (req, res) => {

  try {
    const client = await pool.connect();

    const sql_marcas = "SELECT CODIGO, NOME FROM MARCAS";

    const result = await client.query(sql_marcas);

    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }

});
// endpoint para buscar os códigos, modelos e observações dos veículos por marca no banco de dados
app.get('/api1/veiculos/:marca', async (req, res) => {
  try {
    const marca = req.params.marca;
    const client = await pool.connect();

    const sql_modelos = "SELECT CODIGO, NOME, OBSERVACOES FROM MODELOS WHERE MARCA_CODIGO = $1";
    const values_modelos = [marca];

    const result = await client.query(sql_modelos,values_modelos);

    res.json({ data: result.rows, count: result.rowCount });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');
  }
});



app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));