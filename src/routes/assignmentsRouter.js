const express = require('express');
const assignmentsService = require('../service/assignmentsService');
const url = require('url');
const accountService = require('../service/accountService');

const router = express.Router();

router.use( async (req, res, next) => {
    if(req.baseUrl != '/vl/assignments') {
        const err = new Error("Invalid Url");
        err.status = 404;
        next(err);
    }

    const authHeader = req.headers.authorization;
    const credentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');

    try {
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
        const assignments = await assignmentsService.getAllAssignments();
        res.json(assignments);
    }
    catch(error) {
        error.status = 400;
        next(error);
    }
});

router.get( "/:id", async ( req, res, next ) => {
    try {
        const id = req.params.id;
        const user_id = req.body.user_id;
        const assignment = await assignmentsService.getAssignment(id, user_id);
        res.json(assignment);
    }
    catch(error) {
        error.status = 403;
        next(error);
    }
});


router.post("/", async ( req, res, next ) => {
    const assignmentObj = req.body;
    console.log(assignmentObj);
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
            console.log("Router");
            const assignment = await assignmentsService.updateAssignment(id, assignmentObj);
            res.status(204);
            res.send();
        } catch (error) {
            error.status = error.status || 400;
            next(error);
        } 
});

router.delete("/:id", async ( req, res, next ) => {
    const id = req.params.id;
    const user_id = req.body.user_id;
    console.log(user_id);
        try {
            const status = await assignmentsService.deleteAssignment(id, user_id);
            res.status(204);
            res.send();
        } catch (error) {
            error.status = error.status || 404;
            next(error);
        } 
});

module.exports = router;

