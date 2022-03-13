const mongoose = require('mongoose');

const conCreate = require("../config/db").conCreate;

const connConnect = require("../config/db").conConnect;

const userModel = require('../model/User');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const emailValidate = require('./emailValidate');

const TimeStamp = require('./TimeStamp');

const sendconfirmOTP = require('./sendConfirmOTP');

const validateInput = require('../utility/validateInput');

/* Create User */
const sendOTP = async (req, res, next) => {

    var email = validateInput(req.headers.email || req.body.email);
    console.log(email);

    try {
        if (!email) {
            return res.status(400).send(JSON.stringify({ "message": "error: Email is required", "ResponseCreatedAt": TimeStamp() }));
        }

        else {
            if (emailValidate(email) == true) {

                const exists = await userModel.exists({ email: email });

                if (exists) {
                    
                    res.send({ "message": "already verified", "status": 201 });

                }
                else {

                    sendconfirmOTPemail = sendconfirmOTP(req, email);

                    res.status(200).send({
                        "message": "OTP send Successfully", "email": email, "status": 200, "ResponseCreatedAt": TimeStamp()
                    });
                    // res.redirect('/user/verify');

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