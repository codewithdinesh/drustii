const mongoose = require('mongoose');

const conCreate = require("../config/db").conCreate;

const connConnect = require("../config/db").conConnect;

const creatorModel = require('../model/creator');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const emailValidate = require('./emailValidate');

const TimeStamp = require('./TimeStamp');

const sendconfirmOTP = require('./sendConfirmOTP');

const validateInput = require('../utility/validateInput');

const otpModel = require('../model/verifyOTP');

/* verify user OTP */
const verifyOTP = async (req, res, next) => {

    var email = validateInput(req.body.email);

    let otp = validateInput(req.body.otp);

    try {
        if (!email) {
            return res.status(400).send(JSON.stringify({ "status": "error: Email is required", "ResponseCreatedAt": TimeStamp() }));
        }

        else {
            if (emailValidate(email) == true) {

                const exists = await creatorModel.exists({ email: email });

                if (exists) {
                    return res.send({ "message": "You are already Verified, Please Login With your creadential", "ResponseCreatedAt": TimeStamp() })
                }
                else {

                    otpModel.findOne({ email: email, otp: otp }, (otpError, otpResult) => {
                        if (otpError) {
                            return res.send({ "message": "Something Error Found in OTP verification", "ResponseCreatedAt": TimeStamp() })
                        }
                        if (otpResult) {

                            console.log(otpResult);

                            res.status(200).send({
                                "message": "OTP Verified", "email": email, "ResponseCreatedAt": TimeStamp()
                            });
                            // detele OTP from database
                            otpModel.findOneAndDelete({ email: email }).exec();


                        } else {
                            return res.send({ "message": "Invalid verification request", "ResponseCreatedAt": TimeStamp() })
                        }

                    })

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

module.exports = verifyOTP;