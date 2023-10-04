const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define("Account", {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
          get() {
            return this.getDataValue('id');
          },
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        account_created: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: new Date().toISOString(),
          set(value) {}
        },
        account_updated: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: new Date().toISOString(),
          set(value) {}
        }
      }, {
        timestamps: false,
      });
}

