// const pool = require('../utilities/connection');
const sequelize = require('../utilities/sequelize');

const pgDB = {}

pgDB.connectDb = async () => {
    // try {
    //     const client = await pool.connect();
    //     client.release();
    //     return true;
    // } catch(error) {
    //     error.status = 503;
    //     throw error;
    // }
    try {
        await sequelize.authenticate();
        return true;
    } catch(error) {
        console.log(error);
        error.status = 503;
        throw error;
    }
}

module.exports = pgDB;
