const sendEmail = require('./reactions/sendEmail');
let axios = require('axios');


module.exports = {
    reaction: {
        sendEmail: sendEmail
    }
};
