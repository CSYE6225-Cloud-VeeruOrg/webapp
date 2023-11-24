require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

const logger = require('./utilities/logger');
const errorLogger = require("./utilities/ErrorLogger");
const requestLogger = require("./utilities/RequestLogger");
const healthRouter = require("./routes/healthRouter");
const assignmentsRouter = require("./routes/assignmentsRouter");
const accountService = require("./service/accountService");

const app = express();

const loadUser = async () => {
    try{
        await accountService.readCSVAndCreateAccounts();
    } catch(error) {
        logger.error(`Error loading user data ${error}`);
    }
}

loadUser();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  next();
});
app.use(requestLogger);
app.use("/healthz", healthRouter);
app.use("/v1/assignments", assignmentsRouter);
app.use((req, res, next) => {
    const err = new Error(` Invalid Url ${req.originalUrl}`);
    err.status = 400;
    next(err);
});
app.use(errorLogger);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      logger.fatal(`Port ${port} is already in use.`);
      process.exit(1);
    } else {
      logger.fatal(`An unexpected error occurred: ${error}`);
      process.exit(1);
    }
  });  

module.exports = app;