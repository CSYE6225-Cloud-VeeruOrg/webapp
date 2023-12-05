const express = require('express');
const assignmentsService = require('../service/assignmentsService');
const url = require('url');
const accountService = require('../service/accountService');
const validator = require('../utilities/validator');
const logger = require('../utilities/logger');
const statsdClient = require('../utilities/statsdConfig');

const router = express.Router();

router.use( async (req, res, next) => {
    if(req.baseUrl != '/v3/assignments') {
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
            req.body.email = email;
            logger.info(`User authenticated: ${email}`);
            next();
        }
    } catch (error) {
        const err = new Error("Unauthorized");
        err.status = 401;
        next(err);
    }
});

router.get( "/", async ( req, res, next ) => {   
    try {
        statsdClient.increment('assignments.api.getAll');
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 2)) {
            const err = new Error("Bad Request: Should not have body and query params");
            err.status = 400;
            throw err;
        }
        const assignments = await assignmentsService.getAllAssignments();
        logger.info(`${assignments.length} assignments retrived successfully`);
        res.json(assignments);
    }
    catch(error) {
        error.status = error.status || 400;
        next(error);

    }
});

router.get( "/:id", async ( req, res, next ) => {
    try {
        statsdClient.increment('assignments.api.getbyId');
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 2)) {
            const err = new Error("Bad Request: Should not have body and query params");
            err.status = 400;
            throw err;
        }
        const id = req.params.id;
        const assignment = await assignmentsService.getAssignment(id);
        logger.info(`Assignment retrived successfully - id: ${id}`);
        res.json(assignment);
    }
    catch(error) {
        error.status = error.status || 400;
        next(error);
    }
});


router.post("/", async ( req, res, next ) => {
    try { 
        statsdClient.increment('assignments.api.post');
        const assignmentObj = req.body;
        if(validator.validateAssignmentObj(assignmentObj)){
            const assignment = await assignmentsService.createAssignment(assignmentObj);
        logger.info(`Assignment created with id: ${assignment.id}`);
        res.status(201);
        res.json(assignment);
        }
    } catch (error) {
        error.status = 400;
        next(error);
    } 
});

router.post("/:id/submission", async (req, res, next) => {
    try {
        statsdClient.increment('assignments_submission.api.post');
        const id = req.params.id;
        const submissionUrl = req.body.submission_url;
        if(validator.validSubmissionUrl(submissionUrl)) {
            const submission = await assignmentsService.submitAssignment(id, submissionUrl, req.body.user_id, req.body.email);
            logger.info(`Assignment with id: ${id} is submitted`);
            res.status(201);
            res.send(submission);
        }
    } catch(error) {
        error.status = error.status || 400;
        next(error);
    }
});

router.put("/:id", async ( req, res, next ) => {
    try {
        statsdClient.increment('assignments.api.put'); 
        const id = req.params.id;
        const assignmentObj = req.body;
        if(validator.validateAssignmentObj(assignmentObj)){
            const assignment = await assignmentsService.updateAssignment(id, assignmentObj);
            logger.info(`Assignment with id: ${id} is updated`);
            res.status(204);
            res.send();
        } 
    } catch (error) {
        error.status = error.status || 400;
        next(error);
    } 
});

router.delete("/:id", async ( req, res, next ) => {
    try {
        statsdClient.increment('assignments.api.delete');
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 2)) {
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
    } catch (error) {
        error.status = error.status || 404;
        next(error);
    } 
    
});

router.use("/", async ( req, res, next ) => {
    statsdClient.increment('assignments.api.invalidMethods');
    const err = new Error("Method not allowed");
    err.status = 405;
    next(err);
});

module.exports = router;

