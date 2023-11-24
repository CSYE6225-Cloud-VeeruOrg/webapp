
association = (sequelize) => {
    const { Account, Assignment, Submission } = sequelize.models;

    Account.hasMany(Assignment, {
        foreignKey: "user_id",
        as: "assignment_id"
    });

    Assignment.belongsTo(Account, {
        foreignKey: "user_id"
    }); 

    Assignment.hasMany(Submission, {
        foreignKey: "assignment_id",
        as: "submission_id"
    })

    Submission.belongsTo(Assignment, {
        foreignKey: "assignment_id"
    }); 
}

module.exports = { association };