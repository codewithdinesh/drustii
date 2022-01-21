const nodemailer = require('nodemailer');
const OTP = require('./otpGenerate');

var transport = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.EMAIL_SMTP_PORT,
    auth: {
        user: process.env.EMAIL_SMTP_AUTH_USER,
        pass: process.env.EMAIL_SMTP_AUTH_PASSWORD
    }
});

const sendconfirmOTP = (req, reqEmail) => {

    var message = {
        from: 'noreply@drustii.in',
        to: reqEmail,
        subject: 'Confirm Email',
        text: 'Please confirm your email',
        html: `<p>Please confirm your email</p><p>${reqEmail}</p><p>OTP: ${OTP}</p>`
    };

    transport.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });

    req.OTP = OTP;
    return OTP;
}



module.exports = sendconfirmOTP;
