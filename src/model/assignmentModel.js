const { models } = require("../utilities/sequelize");

exports.assignmentModel = {
  getAllAssignments: async () => {
    try {
      const assignments = await models.Assignment.findAll();
      console.log(assignments);
      if(assignments.length > 0){
        return assignments;
      }
    } catch(error) {
      throw error;
    }
  },
  
  getAssignment: async function (id, user_id) {
    try {
      const assignment = await models.Assignment.findOne({ where : { id : id } });
      console.log(!(assignment.user_id === user_id));
      console.log(assignment.user_id + " " + user_id);
      if(!(assignment.user_id === user_id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
      }
      if(assignment != null){
        return assignment;
      } else {
        const err = new Error("Not found");
        throw err;
      }
    } catch(error) {
      throw error;
    }
  },
  
  createAssignment: async function (assignmentObj) {
    try {
      const assignment = await models.Assignment.create({
        name: assignmentObj.name,
        points: assignmentObj.points,
        num_of_attemps: assignmentObj.num_of_attemps,
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
      console.log("Model");
      const isExists = await this.getAssignment(id, assignmentObj.user_id);
      console.log("Model 1");
      console.log(isExists);
      if(isExists) {
        const updatedAssignment = await models.Assignment.update({
          name: assignmentObj.name,
          points: assignmentObj.points,
          num_of_attemps: assignmentObj.num_of_attemps,
          deadline: assignmentObj.deadline
        }, {
          where: { id : id }
        });
        return updatedAssignment;
      }
    } catch(error) {
      throw error;
    }
  },
  
  deleteAssignment: async function (id, user_id) {
    try {
      console.log("model delete");
      const isExists = await this.getAssignment(id, user_id);
      console.log(isExists);
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
    } catch(error) {
      throw error;
    }
  }
}
