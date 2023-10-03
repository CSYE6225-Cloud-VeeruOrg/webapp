const express = require('express');
const healthService = require('../service/healthService');
const url = require('url');

const router = express.Router();

router.use((req, res, next) => {
    const pathname = url.parse(req.url).pathname;
    if(pathname != '/healthz') {
        const err = new Error("Bad Request");
        err.status = 400;
        next(err);
    }
    next();
});

router.get( "/healthz", async ( req, res, next ) => {
    if(Object.keys(req.query).length > 0) {
        const err = new Error("Bad Request");
        err.status = 400;
        next(err);
    }
    else {
        try {
            const status = await healthService.healthCheck();
            if(status) {
                res.send();
            }
        }
        catch(error) {
            error.status = 503;
            next(error);
        }
    }
});

router.put("/healthz", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

router.post("/healthz", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

router.patch("/healthz", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

router.delete("/healthz", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

module.exports = router;

