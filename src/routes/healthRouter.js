const express = require('express');
const healthService = require('../service/healthService');
const logger = require('../utilities/logger');
const statsdClient = require('../utilities/statsdConfig');

const router = express.Router();

router.use((req, res, next) => {
    if(req.baseUrl != '/healthz') {
        const err = new Error("Bad Request");
        err.status = 400;
        return next(err);
    }
    next();
});

router.get( "/", async ( req, res, next ) => {
    try{
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 0)) {
            const err = new Error("Bad Request: Should not have body and query params");
            err.status = 400;
            next(err);
        }
        else {
            const status = await healthService.healthCheck();
            if(status) {
                logger.info('DB connection live.')
                res.send();
            }
        }
        statsdClient.increment('healthz.api.get');
    } catch(error) {
        error.message = "DB connection refused";
        error.status = 503;
        next(error);
    }  
});

router.use("/", async ( req, res, next ) => {
    statsdClient.increment('healthz.api.invalidMethod');
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

module.exports = router;