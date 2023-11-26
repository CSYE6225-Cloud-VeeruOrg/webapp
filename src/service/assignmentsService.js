const { assignmentModel } = require('../model/assignmentModel');
const sns = require('../utilities/sns');

const assignmentsService = {}

assignmentsService.getAllAssignments = async () => {
    try {
        const assignments = await assignmentModel.getAllAssignments();
        return assignments;
    } catch (error) {
        throw error;
    }
};

assignmentsService.getAssignment = async (id) => {
    try {
        const assignment = await assignmentModel.getAssignment(id);
        return assignment;
    } catch (error) {
        throw error;
    }
};

assignmentsService.createAssignment = async (assignmentObj) => {
    try {
        const assignment = await assignmentModel.createAssignment(assignmentObj);
        return assignment;
    } catch (error) {
        throw error;
    }
};

assignmentsService.submitAssignment = async (assignmentId, submissionUrl, userId, userEmail) => {
    try {
        const assignment = await assignmentModel.getAssignment(assignmentId);
        const noOfSubmissions = await assignmentModel.getSubmissions(assignmentId, userId);
        const assignmentDueDate = new Date(assignment.deadline);
        const currentDate = new Date();
        if(assignment.num_of_attempts > noOfSubmissions) {
            if(assignmentDueDate > currentDate) {
                const submission = await assignmentModel.createSubmission(assignment, submissionUrl, userId);
                await sns.post(userEmail, submission, noOfSubmissions);
                return submission;
            } else {
                const err = new Error("Can not submit. Due date has passed.");
                err.status = 400;
                throw err; 
            }   
        } else {
            const err = new Error("Can not submit. No of attempts limit exceded.");
            err.status = 400;
            throw err;
        }
    } catch (error) {
        throw error;
    }
};

assignmentsService.updateAssignment = async (id, assignmentObj) => {
    try {
        const assignment = await assignmentModel.updateAssignment(id, assignmentObj);
        return assignment;
    } catch (error) {
        throw error;
    }
};

assignmentsService.deleteAssignment = async (id, user_id) => {
    try {
        const submissions = await assignmentModel.getSubmissions(id);
        console.log(submissions);
        if(submissions == 0) {
            const status = await assignmentModel.deleteAssignment(id, user_id);
            if(status){
                return true;
            }
        } else {
            const err = new Error("Cannot delete assignment, there are submissions");
            err.status = 409;
            throw err; 
        }
    } catch(error) {
        throw error;
    }
};

module.exports = assignmentsService;