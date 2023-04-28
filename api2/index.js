const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3002;
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:Postgres2022!@localhost:5432/projeto';

// requisições http
const axios = require('axios');

// pubsub gcp
const { PubSub } = require('@google-cloud/pubsub')


const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.connect();

app.use(bodyParser.json());

// endpoint para buscar as marcas no serviço da FIPE
app.get('/marcas/load', async (req, res) => {
  try {
    const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const marcas = response.data;

    const pubsub = new PubSub();

    for (let index = 0; index < marcas.length; index++) {
      const element = marcas[index];
      const jobData = Buffer.from(JSON.stringify(element))

      await pubsub.topic('queue_bex').publish(jobData);

      continue;
    }

    res.json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something broke!');

  }

});

// endpoint para buscar os códigos, modelos e observações dos veículos por marca no banco de dados
app.get('/veiculos/:marca', (req, res) => {
  const marca = req.params.marca;
  // lógica para buscar os veículos no banco de dados
  // ...
  // retorna os veículos em formato JSON
  res.json(veiculos);
});

// endpoint para salvar os dados alterados do veículo no banco de dados
app.put('/veiculos/:id', (req, res) => {
  const id = req.params.id;
  const { modelo, observacoes } = req.body;
  // lógica para atualizar os dados do veículo no banco de dados
  // ...
  // retorna uma mensagem indicando sucesso ou falha
  res.json({ message: 'Dados do veículo atualizados com sucesso!' });
});


function consumer() {
  console.log("Ininicando consumidor");
  const pubsub = new PubSub()
  const subscription = pubsub.subscription('subscription_name')
  subscription.on('message', message => {
    const { data } = message
    console.log(data.toString());


    message.ack() // This deletes the message from the queue
  })
}
consumer();
app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));