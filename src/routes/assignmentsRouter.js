const express = require('express');
const assignmentsService = require('../service/assignmentsService');
const url = require('url');
const accountService = require('../service/accountService');
const validator = require('../utilities/validator');

const router = express.Router();

router.use( async (req, res, next) => {
    if(req.baseUrl != '/vl/assignments') {
        const err = new Error("Invalid Url");
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
            next();
        }
    } catch (error) {
        error.status = 401;
        next(error);
    }
});

router.get( "/", async ( req, res, next ) => {
    
    
    try {
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 1)) {
            const err = new Error("Bad Request");
            err.status = 400;
            throw err;
        }
        const assignments = await assignmentsService.getAllAssignments();
        res.json(assignments);
    }
    catch(error) {
        error.status = error.status || 400;
        next(error);

    }
});

router.get( "/:id", async ( req, res, next ) => {
    
    try {
        if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 1)) {
            const err = new Error("Bad Request");
            err.status = 400;
            throw err;
        }
        const id = req.params.id;
        const assignment = await assignmentsService.getAssignment(id);
        res.json(assignment);
    }
    catch(error) {
        error.status = error.status || 400;
        next(error);
    }
});


router.post("/", async ( req, res, next ) => {
    const assignmentObj = req.body;
        try {
            const assignment = await assignmentsService.createAssignment(assignmentObj);
            res.status(201);
            res.json(assignment);
        } catch (error) {
            error.status = 400;
            next(error);
        } 
});

router.put("/:id", async ( req, res, next ) => {
    const id = req.params.id;
    const assignmentObj = req.body;
        try {
            if(validator.validateAssignmentObj(assignmentObj)){
                const assignment = await assignmentsService.updateAssignment(id, assignmentObj);
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
            if(Object.keys(req.query).length > 0 || (req.body && Object.keys(req.body).length > 1)) {
                const err = new Error("Bad Request");
                err.status = 400;
                throw err;
            }
            const id = req.params.id;
            const user_id = req.body.user_id;
            const status = await assignmentsService.deleteAssignment(id, user_id);
            res.status(204);
            res.send();
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

