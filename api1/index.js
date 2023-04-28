const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;
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

// // endpoint para buscar as marcas no serviço da FIPE
// 1. Criar um serviço REST na API-1 para acionar a ”carga” dos dados de veículos.
// 2. Implementar a lógica na API-1 para buscar as "marcas" no serviço da  FIPE (https://deividfortuna.github.io/fipe/).
// 3. Configurar uma “Fila” para receber as "marcas" da API-1 e enviar uma por vez para a API-2 para processamento assíncrono.
app.get('/api1/marcas/load', async (req, res) => {
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
app.get('api1/veiculos/:marca', (req, res) => {
  const marca = req.params.marca;
  // lógica para buscar os veículos no banco de dados
  // ...
  // retorna os veículos em formato JSON
  res.json(veiculos);
});

// endpoint para salvar os dados alterados do veículo no banco de dados
app.put('api1/veiculos/:id', (req, res) => {
  const id = req.params.id;
  const { modelo, observacoes } = req.body;
  // lógica para atualizar os dados do veículo no banco de dados
  // ...
  // retorna uma mensagem indicando sucesso ou falha
  res.json({ message: 'Dados do veículo atualizados com sucesso!' });
});



app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));