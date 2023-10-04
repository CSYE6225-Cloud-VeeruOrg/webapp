const express = require('express');
const healthService = require('../service/healthService');

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
    console.log("get");
    if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 0)) {
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

router.put("/", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

router.post("/", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

router.patch("/", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

router.delete("/", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

module.exports = router;