let axios = require('axios');
var nodeMailer = require('nodemailer');

var mailServer = nodeMailer.createTransport({
    host: 'mail.mailo.com',
    port: 465,
    secure: true,
    auth: {
        user: 'area51.project@mailo.com',
        pass: 'AREA51project'
    }
});

module.exports = {
    mailServer: mailServer
};