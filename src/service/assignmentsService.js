const { assignmentModel } = require('../model/assignmentModel');

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
        const status = await assignmentModel.deleteAssignment(id, user_id);
        if(status){
            return true;
        }
    } catch(error) {
        throw error;
    }
};

module.exports = assignmentsService;