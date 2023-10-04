
association = (sequelize) => {
    const { Account, Assignment } = sequelize.models;

    Account.hasMany(Assignment, {
        foreignKey: "user_id",
        as: "assignment_id"
    });

    Assignment.belongsTo(Account, {
        foreignKey: "user_id"
    }); 
}

module.exports = { association };