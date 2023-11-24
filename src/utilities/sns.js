// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
// const AWS = require('aws-sdk');
// const logger = require('../utilities/logger');

// const sns = {};

// sns.post = async (submissionUrl, user_id) => {
//     try{
//         AWS.config.update({
//             accessKeyId: process.env.ACCESS_KEY,
//             secretAccessKey: process.env.SECRET_ACCESS_KEY,
//             region: process.env.AWS_REGION,
//         });
//         const sns = new AWS.SNS();

//         const message = {
//             submissionUrl: submissionUrl,
//             user_id: user_id
//         };

//         const topicName = process.env.TOPIC_NAME;

//         sns.listTopics((err, data) => {
//             if (err) {
//                 const error = new Error("Error listing topics");
//                 error.stack = err;
//                 error.status = 400;
//                 throw error;
//             } else {
//                 const topics = data.Topics;
//                 const topic = topics.find(t => t.TopicArn.includes(topicName));

//                 if (topic) {
//                     const topicArn = topic.TopicArn;
//                     logger.info('Found topic ARN:', topicArn);
//                     const params = {
//                         Message: message,
//                         TopicArn: topicArn,
//                     };
                
//                     sns.publish(params, (err, data) => {
//                     if (err) {
//                         const error = new Error("Error publishing message");
//                         error.stack = err;
//                         error.status = 400;
//                         throw error;
//                     } else {
//                         logger.info('Message published successfully:', data.MessageId);
//                     }
//                     });
//                 } else {
//                     logger.error(`Topic ${topicName} not found.`);
//                 }
//             }
//         });
//     } catch(error) {
//         throw error;
//     }
    
// };

// module.exports = sns;

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const AWS = require('aws-sdk');
const logger = require('../utilities/logger');

const sns = {};

sns.post = async (user_id, submission, noOfSubmissions) => {
    try {
        AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        const snsClient = new AWS.SNS();
 
        const message = {
            submissionDetails: submission,
            userId: user_id,
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