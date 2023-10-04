require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");


const errorLogger = require("./utilities/ErrorLogger");
const requestLogger = require("./utilities/RequestLogger");
const healthRouter = require("./routes/healthRouter");
const accountService = require("./service/accountService");

const app = express();

const loadUser = async () => {
    try{
        await accountService.readCSVAndCreateAccounts();
    } catch(error) {
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
app.use((req, res, next) => {
    const err = new Error("Invalid Url");
    err.status = 404;
    next(err);
});
app.use(errorLogger);

app.listen(4000);
console.log("Server listening in port 4000 ");

module.exports = app;