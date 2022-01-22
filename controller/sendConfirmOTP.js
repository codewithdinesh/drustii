const nodemailer = require('nodemailer');
const verifyOTP = require('../model/verifyOTP');
const OTP = require('./otpGenerate');
const TimeStamp = require('./TimeStamp');

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
        html: `<p>Please confirm your email </p><p>${reqEmail}</p> <p>OTP: ${OTP}</p> <p> OTP is valid for 5 minutes only.</p>`
    };

    transport.sendMail(message, (error, info) => {
        if (error) {
            return console.log(error);
        }

        const userOtp = new verifyOTP({
            "email": reqEmail,
            "otp": OTP
        });
        userOtp.save();
        console.log('Message sent: %s', info.messageId);
    });
}



module.exports = sendconfirmOTP;
