import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
class Model {
  constructor(table) {
    this.table = table;

    this.pool = new Pool({
      connectionString: process.env.NODE_ENV==="testing"?process.env.DATABASE_URL_TEST :process.env.NODE_ENV==="production"?process.env.DATABASE_URL:process.env.DATABASE_URL_DEV,
      ssl:{
        rejectUnauthorized:false
      }
    });

    this.pool.on('error', (err, client) => {
      console.log('freeMentors-db-error: ', err);
    });
  }


  // CRUD - READ Operation
   select = async (columns, clause, values) => {
     try {
       let query;
       if (clause) {
         query = `SELECT ${columns} FROM ${this.table} WHERE ${clause}`;
       } else {
         query = `SELECT ${columns} FROM ${this.table}`;
       }
       const { rows } = await this.pool.query(query, values);
       return rows;
     } catch (err) {
       throw err;
     }
   }

   selectMessages = async (id) => {
     try {
       let query= `SELECT * FROM messages WHERE senderId=${id} OR receiverId=${id}`;
       const { rows } = await this.pool.query(query);
       return rows;
      } catch (err) {

      throw err;
    }
  }

   // CRUD - CREATE Operation
   async insert(columns, selector, values) {
     const query = `INSERT INTO ${this.table} (${columns}) VALUES (${selector}) returning *`;
     try {
       // console.log(query);
       const { rows } = await this.pool.query(query, values);
       return rows;
     } catch (err) {
       throw err;
     }
   }

   // CRUD - UPDATE Operation
   async update(columns, clause, values) {
     const query = `UPDATE ${this.table} SET ${columns} WHERE ${clause} returning *`;
     try {
       const { rows } = await this.pool.query(query, values);
       return rows[0];
     } catch (err) {
       throw err;
     }
   }

   // CRUD - DELETE Operation
   async delete(clause, values) {
     const query = `DELETE FROM ${this.table} WHERE ${clause} returning *`;
     try {
       const { rows } = await this.pool.query(query, values);
       return rows[0];
     } catch (err) {
       throw err;
     }
   }
}

export default Model;