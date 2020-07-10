const { Pool, Client } = require('pg');
const { query } = require('express');
// const pool = new Pool({
//   user: 'dbuser',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211,
// })
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })



const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'authentication',
  password: '1234',
  port: 5432,
})

const createUser = (email,password) => {
    let values = [email,password];
    let query = 'INSERT into users (email, id ,password) VALUES($1,DEFAULT,$2) RETURNING id';
    runQuery(query,values);
}

const connectToDb = () => {
    client.connect();
}

const runQuery = (query,values) => {
    client.query(query,values, (err, res) => {
        console.log(err,res);
      })
}

const disconnectFromDb = () => {
    client.end();
}


exports.connectToDb = connectToDb;
exports.runQuery = runQuery;
exports.disconnectFromDb = disconnectFromDb;
exports.createUser = createUser;