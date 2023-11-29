const validator = {}

validator.validateAssignmentObj = (assignmentObj) => {
    if(assignmentObj.name == null || assignmentObj.name == "" || assignmentObj.points == null || assignmentObj.num_of_attempts == null || assignmentObj.deadline == null) {
        const err = new Error("Invalid assignment values");
        err.status = 400;
        throw err;
    } else {
        return true;
    }
}

validator.validSubmissionUrl = (submissionUrl) => {
    if(submissionUrl == null || submissionUrl == "" || !submissionUrl.endsWith(".zip")) {
        const err = new Error("Invalid submission Url");
        err.status = 400;
        throw err;
    } else {
        return true;
    }
}

module.exports = validator;