// const { DataTypes } = require("sequelize");
// const sequelize = require("../utilities/sequelize");
const { models } = require("../utilities/sequelize");
const logger = require('../utilities/logger');

exports.accountModel = {
  createAccount: async (data) => {
    try {
    const existingUser = await models.Account.findOne({ where: { email: data.email } });
    if (!existingUser) {
      await models.Account.create({
        firstName: data.first_name,
        lastName: data.last_name,
        password: data.password,
        email: data.email
      });
      logger.info(`Account created: ${data.email}`);
    } else {
      logger.info(`Account already exists: ${data.email}`);
    }
    } catch (error) {}
  
    
  },
  
  findAccount : async (email) => {
    const account = await models.Account.findOne({ where : { email : email } });
    if(account != null) {
      return account.dataValues;
    } else {
      const err = new Error(`No user found with email: ${email}`);
      throw err;
    }
  }
}