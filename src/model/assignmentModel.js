const { models } = require("../utilities/sequelize");

exports.assignmentModel = {
  getAllAssignments: async () => {
    try {
      const assignments = await models.Assignment.findAll();
      if(assignments.length > 0){
        return assignments;
      } else {
        const err = new Error("No Assignments");
        err.status = 404;
        throw err;
      }
    } catch(error) {
      throw error;
    }
  },
  
  getAssignment: async function (id) {
    try {
      const assignment = await models.Assignment.findOne({ where : { id : id } });
      if(assignment != null){
        return assignment;
      } else {
        const err = new Error("Not found");
        err.status = 404;
        throw err;
      }
    } catch(error) {
      error.status = 404;
      throw error;
    }
  },
  
  createAssignment: async function (assignmentObj) {
    try {
      const assignment = await models.Assignment.create({
        name: assignmentObj.name,
        points: assignmentObj.points,
        num_of_attempts: assignmentObj.num_of_attempts,
        deadline: assignmentObj.deadline,
        user_id: assignmentObj.user_id
      });
      return assignment;
    } catch(error) {
      throw error;
    }
  
  },

  updateAssignment: async function (id, assignmentObj) {
    try {
      const assignment = await this.getAssignment(id, assignmentObj.user_id);
      if(assignment.user_id == assignmentObj.user_id) {
          const updatedAssignment = await models.Assignment.update({
          name: assignmentObj.name,
          points: assignmentObj.points,
          num_of_attempts: assignmentObj.num_of_attempts,
          deadline: assignmentObj.deadline,
          assignment_updated: new Date()
        }, {
          where: { id : id }
        });
        return updatedAssignment;
      } else {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
      }
    } catch(error) {
      throw error;
    }
  },

  
  deleteAssignment: async function (id, user_id) {
    try {
      const assignment = await this.getAssignment(id);
      if(assignment.user_id == user_id) {
        const deletedRows = await models.Assignment.destroy({
          where: {
            id : id
          }
        });
        if(deletedRows == 1) {
          return true;
        } else {
          const err = new Error("Assignment not found");
          throw err;
        }
      } else {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
      }
      
      
    } catch(error) {
      throw error;
    }
  }
}
