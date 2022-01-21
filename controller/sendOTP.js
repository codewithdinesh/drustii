const mongoose = require('mongoose');

const Fileupload = require("./FileUpload");

const conCreate = require("../config/db").conCreate;

const connConnect = require("../config/db").conConnect;

const creatorModel = require('../model/creator');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const emailValidate = require('./emailValidate');

const usernameValidate = require('./userNameValidate');

const TimeStamp = require('./TimeStamp');

const sendconfirmOTP = require('./emailVerification')

/* Create User */
const sendOTP = async (req, res, next) => {
    var email = req.body.email;
    try {
        if (!email) {
            return res.status(400).send(JSON.stringify({ "status": "error: Email is required", "ResponseCreatedAt": TimeStamp() }));

        }

        else {
            if (emailValidate(email) == true) {

                const exists = await creatorModel.exists({ email: email });

                if (exists) {

                }
                else {

                    email = email.trim();
                    sendconfirmOTPemail = await sendconfirmOTP(req, email);

                    res.status(200).send({
                        "message": "OTP send Successfully", "email": email, "ResponseCreatedAt": TimeStamp()
                    })


                }
            } else {
                return res.status(400).send(JSON.stringify({ "status": "Invalid Email", "ResponseCreatedAt": TimeStamp() }));
            }
        }

    }

    catch {
        return res.status(400).send(JSON.stringify({ "status": "Something Error In Server", "ResponseCreatedAt": TimeStamp() }));
    }

}

module.exports = sendOTP;