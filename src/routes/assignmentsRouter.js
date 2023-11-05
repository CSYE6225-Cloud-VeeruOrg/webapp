const express = require('express');
const assignmentsService = require('../service/assignmentsService');
const url = require('url');
const accountService = require('../service/accountService');
const validator = require('../utilities/validator');
const logger = require('../utilities/logger');
const statsdClient = require('../utilities/statsdConfig');

const router = express.Router();

router.use( async (req, res, next) => {
    if(req.baseUrl != '/vl/assignments') {
        const err = new Error(`Invalid Url ${req.originalUrl}`);
        err.status = 400;
        next(err);
    }    
    try {
        const authHeader = req.headers.authorization;
        const credentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
        const [email, password] = decodedCredentials.split(':');
        const isAuthenticated = await accountService.authenticateAccount(email, password);
        if(isAuthenticated != null) {
            req.body.user_id = isAuthenticated.id;
            logger.info(`User authenticated: ${email}`);
            next();
        }
    } catch (error) {
        error.status = 401;
        next(error);
    }
});

router.get( "/", async ( req, res, next ) => {   
    try {
        const startTime = process.hrtime();
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 1)) {
            const err = new Error("Bad Request: Should not have body and query params");
            err.status = 400;
            throw err;
        }
        const assignments = await assignmentsService.getAllAssignments();
        logger.info(`${assignments.length} assignments retrived successfully`);
        res.json(assignments);
        const elapsed = process.hrtime(startTime);
        const elapsedTimeInSeconds = elapsed[0] * 1000 + elapsed[1] / 1e9;
        statsdClient.increment('assignments.api.getAll');
        statsdClient.timing('assignments.api.getAll.response_time', elapsedTimeInSeconds);
    }
    catch(error) {
        error.status = error.status || 400;
        next(error);

    }
});

router.get( "/:id", async ( req, res, next ) => {
    try {
        const startTime = process.hrtime();
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 1)) {
            const err = new Error("Bad Request: Should not have body and query params");
            err.status = 400;
            throw err;
        }
        const id = req.params.id;
        const assignment = await assignmentsService.getAssignment(id);
        logger.info(`Assignment retrived successfully - id: ${id}`);
        res.json(assignment);
        const elapsed = process.hrtime(startTime);
        const elapsedTimeInSeconds = elapsed[0] * 1000 + elapsed[1] / 1e9;
        statsdClient.increment('assignments.api.getbyId');
        statsdClient.timing('assignments.api.getbyId.response_time', elapsedTimeInSeconds);
    }
    catch(error) {
        error.status = error.status || 400;
        next(error);
    }
});


router.post("/", async ( req, res, next ) => {
    try {
        const startTime = process.hrtime();
        const assignmentObj = req.body;
        if(validator.validateAssignmentObj(assignmentObj)){
            const assignment = await assignmentsService.createAssignment(assignmentObj);
        logger.info(`Assignment created with id: ${assignment.id}`);
        res.status(201);
        res.json(assignment);
        } 
        const elapsed = process.hrtime(startTime);
        const elapsedTimeInSeconds = elapsed[0] * 1000 + elapsed[1] / 1e9;
        statsdClient.increment('assignments.api.post');
        statsdClient.timing('assignments.api.post.response_time', elapsedTimeInSeconds);
    } catch (error) {
        error.status = 400;
        next(error);
    } 
});

router.put("/:id", async ( req, res, next ) => {
    try {
        const startTime = process.hrtime();
        const id = req.params.id;
        const assignmentObj = req.body;
        if(validator.validateAssignmentObj(assignmentObj)){
            const assignment = await assignmentsService.updateAssignment(id, assignmentObj);
            logger.info(`Assignment with id: ${id} is updated`);
            res.status(204);
            res.send();
        }   
        const elapsed = process.hrtime(startTime);
        const elapsedTimeInSeconds = elapsed[0] * 1000 + elapsed[1] / 1e9;
        statsdClient.increment('assignments.api.put');
        statsdClient.timing('assignments.api.put.response_time', elapsedTimeInSeconds);  
    } catch (error) {
        error.status = error.status || 400;
        next(error);
    } 
});

router.delete("/:id", async ( req, res, next ) => {
    try {
        const startTime = process.hrtime();
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 1)) {
            const err = new Error("Bad Request: Should not have body and query params");
            err.status = 400;
            throw err;
        }
        const id = req.params.id;
        const user_id = req.body.user_id;
        const status = await assignmentsService.deleteAssignment(id, user_id);
        logger.info(`Assignment with id: ${id} is deleted`);
        res.status(204);
        res.send();
        const elapsed = process.hrtime(startTime);
        const elapsedTimeInSeconds = elapsed[0] * 1000 + elapsed[1] / 1e9;
        statsdClient.increment('assignments.api.delete');
        statsdClient.timing('assignments.api.delete.response_time', elapsedTimeInSeconds);
    } catch (error) {
        error.status = error.status || 404;
        next(error);
    } 
    
});

router.use("/", async ( req, res, next ) => {
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

module.exports = router;

