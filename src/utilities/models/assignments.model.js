const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Assignment', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
          get() {
            return this.getDataValue('id');
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
              min: 1,
              max: 10,
            }
        },
        num_of_attempts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 100
          },
        },
        deadline: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        user_id: {
            type:DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Accounts",
                key: "id",
              }
        },
        assignment_created: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          set(value) {}
        },
        assignment_updated: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        }
      }, {
        timestamps: false,
      });
}