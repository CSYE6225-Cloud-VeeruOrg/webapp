const pool = require('../utilities/connection');

const pgDB = {}

pgDB.connectDb = async () => {
    try {
        const client = await pool.connect();
        client.release();
        return true;
    } catch(error) {
        error.status = 503;
        throw error;
    }
}

module.exports = pgDB;
