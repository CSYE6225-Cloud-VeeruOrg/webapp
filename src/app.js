const express = require('express');
const bodyParser = require('body-parser');

const errorLogger = require('./utilities/ErrorLogger');
const requestLogger = require('./utilities/RequestLogger');
const healthRouter = require('./routes/healthRouter');

const app = express();

app.use( bodyParser.json() );
app.use( (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
app.use( requestLogger );
app.use( '/', healthRouter );
app.use( errorLogger );

app.listen( 4000 );
console.log( "Server listening in port 4000 " );

module.exports = app;