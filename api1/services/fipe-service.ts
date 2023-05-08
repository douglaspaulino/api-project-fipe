import { BadRequestError } from "../errors/bad-request-error";

// requisições http
const pg = require('pg');

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

export class FipeService {
  static async loadData() {
    try {
      const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
      const marcas = response.data;
  
  
  
      for (let index = 0; index < marcas.length; index++) {
        const element = marcas[index];
        console.log("enviando mensagem ==> " + JSON.stringify(element));
  
        const jobData = Buffer.from(JSON.stringify(element))
        await pubsub.topic('queue_bex').publish(jobData);
  
      }
  
      // res.json(marcas);
      return marcas;
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Erro ao processar carregamento "+error);

      // res.status(500).send('Something broke!');
  
    }
  }

  static async getMarcas() {
    const client = await pool.connect();

    try {
  
      const sql_marcas = "SELECT CODIGO, NOME FROM MARCAS";
  
      const result = await client.query(sql_marcas);
  
      return { data: result.rows, count: result.rowCount };
    } catch (error) {

      throw new BadRequestError("Erro ao processar getMarcas "+error);

    }finally {
      await client.release();
    }
  }

  static async getMarcasById(codigo: string) {
    const client = await pool.connect();

    try {
  
      const sql_modelos = "SELECT CODIGO, NOME, OBSERVACOES FROM MODELOS WHERE CODIGO = $1";
      const values_modelos = [codigo];
  
      const result = await client.query(sql_modelos,values_modelos);
      if (result.rows && result.rows.length === 1) {
        return({ data: result.rows[0], count: result.rowCount });
  
      } else {
        throw Error("Something broke!")
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Erro ao processar getMarcas "+error);
    }finally {
      await client.release();
    }
  }

}