const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../commons/db')

const PORT = process.env.PORT || 3001;

import { api1Routes } from "./routes";

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(api1Routes);
// // endpoint para buscar as marcas no serviço da FIPE
// 1. Criar um serviço REST na API-1 para acionar a ”carga” dos dados de veículos.
// 2. Implementar a lógica na API-1 para buscar as "marcas" no serviço da  FIPE (https://deividfortuna.github.io/fipe/).
// 3. Configurar uma “Fila” para receber as "marcas" da API-1 e enviar uma por vez para a API-2 para processamento assíncrono.




// endpoint para buscar os códigos, modelos e observações dos veículos por marca no banco de dados
// app.get('/api1/veiculos/:codigo', async (req, res) => {
//   const client = await connectDB.connect();

//   try {
//     const codigo = req.params.codigo;

//     const sql_modelos = "SELECT CODIGO, NOME, OBSERVACOES FROM MODELOS WHERE CODIGO = $1";
//     const values_modelos = [codigo];

//     const result = await client.query(sql_modelos,values_modelos);
//     if (result.rows && result.rows.length === 1) {
//       res.json({ data: result.rows[0], count: result.rowCount });

//     } else {
//       throw Error("Something broke!")
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Something broke!');
//   }finally {
//     await client.release();
//   }
// });



app.listen(PORT, () => console.log(`App rodando na porta ${PORT}`));