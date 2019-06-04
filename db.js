// connect to DB
const db = require('knex')({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME
    },
    acquireConnectionTimeout: 5000
  });

  module.exports = db;
  