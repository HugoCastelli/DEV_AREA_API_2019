const axios = require('axios');
let emailUtils = require('../emailUtils');

const sendEmail = async (inputData, serviceData) => {
    var mailOptions = {
        from: `'AREA_51' <area51.project@mailo.com>`,
        to: inputData.email,
        cc: inputData.cc,
        bcc: inputData.cci,
        subject: inputData.subject,
        html: inputData.message
    };

    emailUtils.mailServer.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('E-mail: ' + info.response);
    });
};

module.exports = {
    inputFields: [
        { key: 'email', label: 'Email', required: true, type: 'inputText' },
        { key: 'cc', label: 'Cc', required: false, type: 'inputText' },
        { key: 'cci', label: 'Cci', required: false, type: 'inputText' },
        { key: 'subject', label: 'Subject', required: true, type: 'inputText' },
        { key: 'message', label: 'Message', required: true, type: 'inputText' }
    ],
    perform: sendEmail
};
