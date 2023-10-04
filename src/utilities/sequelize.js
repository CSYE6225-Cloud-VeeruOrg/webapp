const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Sequelize } = require('sequelize');
const { association } = require("./accountAssignment");

const sequelize = new Sequelize({
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  dialect: 'postgres',
  logging: false
});

const modelDefiners = [
    require("./models/account.model"),
    require("./models/assignments.model")
  ];
  
  for(const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
  }
  
  association(sequelize);


module.exports = sequelize;
