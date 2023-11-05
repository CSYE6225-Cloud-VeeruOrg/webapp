const StatsD = require('node-statsd');
// const client = new StatsD();

const statsdConfig = {
  host: 'localhost',
  port: 8125,
};

const statsdClient = new StatsD(statsdConfig);

module.exports = statsdClient;