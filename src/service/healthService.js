const pgDB = require('../model/healthModel');

const healthService = {}

healthService.healthCheck = async () => {
    const status = await pgDB.connectDb();
    if(status) {
        return true;
    }
};

module.exports = healthService;
