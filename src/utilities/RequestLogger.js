const fs = require( 'fs' );
const logger = require('./logger');

let requestLogger = ( req, res, next ) => {
    let logMessage = "" + req.method + " " + req.url;
    logger.info(logMessage);
    // fs.appendFile( './RequestLogger.txt', logMessage, ( err ) => {
    //     if( err ) return next( err );
    // } );
    next();

}

module.exports = requestLogger;