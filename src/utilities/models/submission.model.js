const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define("Submission", {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
          get() {
            return this.getDataValue('id');
          },
        },
        assignment_id: {
          type: DataTypes.UUID,
          allowNull: false,
          get() {
            return this.getDataValue('assignment_id');
          },
          references: {
            model: "Assignments",
            key: "id",
          }
        },
        user_id: {
          type:DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Accounts",
            key: "id",
          }
        },
        submission_url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        submission_date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          set(value) {}
        },
        submission_updated: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        }
      }, {
        timestamps: false,
      });
}

