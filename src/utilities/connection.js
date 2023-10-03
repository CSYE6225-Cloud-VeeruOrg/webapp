const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  user: process.env.PGDB,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

pool.on("error", (err, client) => {});

module.exports = pool;

