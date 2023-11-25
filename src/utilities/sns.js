const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const AWS = require('aws-sdk');
const logger = require('../utilities/logger');

const sns = {};

sns.post = async (userEmail, submission, noOfSubmissions) => {
    try {
        // AWS.config.update({
        //     accessKeyId: process.env.ACCESS_KEY,
        //     secretAccessKey: process.env.SECRET_ACCESS_KEY,
        //     region: process.env.AWS_REGION,
        // });

        
        const snsClient = new AWS.SNS();
 
        const message = {
            submissionDetails: submission,
            userId: userEmail,
            noOfSubmissions: noOfSubmissions
        };

        const topicArn = process.env.TOPIC_ARN;

        const params = {
            Message: JSON.stringify(message),
            TopicArn: topicArn,
        };

        const publishData = await snsClient.publish(params).promise();
        console.log(message);
        console.log(publishData);
        logger.info(`Message published successfully: ${publishData.MessageId}`);
    } catch (error) {
        throw error;
    }
};

module.exports = sns;