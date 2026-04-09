const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-hospital-email@gmail.com',
        pass: 'your-app-password' // Not your login password, a Google App Password
    }
});

module.exports = transporter;