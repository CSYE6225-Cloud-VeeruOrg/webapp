const fs = require( 'fs' );
const logger = require('./logger');

let errorLogger = ( err, req, res, next ) => {
    // fs.appendFile( './ErrorLogger.txt', err.stack + "\n", ( error ) => {
    //     if( error ) console.log( "logging error failed" );
    // } );
    // if (/^\s/.test(err.message)) {
    //     logger.error(err.stack);
    // } else {
    //     logger.error(err.message + "\n" + err.stack);
    // }
    logger.error(err.stack);
    if( err.status ) res.status( err.status );
    else res.status( 400 );
    res.send(); 
    next();
}

module.exports = errorLogger;