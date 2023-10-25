const fs = require( 'fs' );

let errorLogger = ( err, req, res, next ) => {
    // fs.appendFile( './ErrorLogger.txt', err.stack + "\n", ( error ) => {
    //     if( error ) console.log( "logging error failed" );
    // } );
    if( err.status ) res.status( err.status );
    else res.status( 400 );
    res.send(); 
    next();
}

module.exports = errorLogger;