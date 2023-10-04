// const pool = require('../utilities/connection');
const sequelize = require('../utilities/sequelize');

const pgDB = {}

pgDB.connectDb = async () => {
    try {
        await sequelize.authenticate();
        return true;
    } catch(error) {
        error.status = 503;
        throw error;
    }
}

module.exports = pgDB;
