const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('../utilities/sequelize');
const { accountModel } = require('../model/accountModel');
const hash = require('../utilities/hashing');
const csvFilePath = '/opt/user.csv';
const logger = require('../utilities/logger');
const { log } = require('console');

const accountService = {}

accountService.readCSVAndCreateAccounts = async () => {
  try {
    await sequelize.sync();

    const stream = fs.createReadStream(csvFilePath);

    stream.on('error', (error) => {
      if (error.code === 'ENOENT') {
        logger.error(`File not found: ${csvFilePath}`);
      } else {
        logger.error('File read error:', error);
      }
    });
    
    stream.pipe(csv())
      .on('data', async (row) => {
        const hashedPassword = await hash.hashPassword(row.password);
        row.password = hashedPassword;
        await accountModel.createAccount(row);
      })
      .on('end', () => {
        logger.info('Users read from CSV successfully.');
      });
  } catch (error) {
    throw error;
  }
}

accountService.authenticateAccount = async (email, password) => {
  try {
    const account = await accountModel.findAccount(email);
    const isValidPassword = await hash.verifyPassword(password, account.password);
    if(isValidPassword) {
      return account;
    } else {
      const err = new Error("Invalid Password");
      throw err;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = accountService;