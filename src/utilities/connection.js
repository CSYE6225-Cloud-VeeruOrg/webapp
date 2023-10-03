const pg = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = new pg.Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

pool.on("error", (err, client) => {});

module.exports = pool;

