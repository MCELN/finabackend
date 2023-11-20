const nodemailer = require('nodemailer');
const { mailer } = require('../config/index');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: mailer.userMail,
        pass: mailer.passMail,
    },
});

module.exports = transport;
