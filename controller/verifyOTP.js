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

const otpModel = require('../model/verifyOTP');
const verifiedUsers = require('../model/verifiedUsers');

/* verify user OTP */
const verifyOTP = async (req, res, next) => {

    var email = validateInput(req.headers.email || req.body.email);

    let otp = validateInput(req.headers.otp || req.body.otp);

    try {

        if (!email) {
            return res.status(400).send(JSON.stringify({ "message": "error: Email is required", "ResponseCreatedAt": TimeStamp() }));
        }

        else {
            if (emailValidate(email) == true) {

                const exists = await userModel.exists({ email: email });
                const verifiedUserExists = await verifiedUsers.exists({ email: email });


                if (exists) {
                    return res.send({ "message": "You are already Verified, Please Login With your creadential", "ResponseCreatedAt": TimeStamp() })
                }
                else {

                    otpModel.findOne({ email: email, otp: otp }, (otpError, otpResult) => {
                        if (otpError) {
                            return res.status(401).send({ "message": "Something Error Found in OTP verification", "status": 401, "ResponseCreatedAt": TimeStamp() })
                        }
                        if (otpResult) {

                            if (!verifiedUserExists) {

                                const verifiedUser = new verifiedUsers({
                                    email: email
                                });

                                verifiedUser.save();
                            } else {

                                verifiedUsers.findOne({ email: email }, {
                                    email: email
                                }).exec();

                            }

                            res.status(200).send({

                                "message": "OTP Verified", "email": email, "status": 200, "ResponseCreatedAt": TimeStamp()

                            });

                            // detele OTP from database
                            otpModel.findOneAndDelete({ email: email }).exec();


                        } else {
                            return res.status(401).send({ "message": "Invalid verification request", "status": 401, "ResponseCreatedAt": TimeStamp() })
                        }

                    })

                    // res.redirect('/user/verify');

                }
            } else {
                return res.status(400).send(JSON.stringify({ "message": "Invalid Email", "status": 400, "ResponseCreatedAt": TimeStamp() }));
            }
        }
    }

    catch {
        return res.status(500).send(JSON.stringify({ "message": "Something Error In Server", "status": 500, "ResponseCreatedAt": TimeStamp() }));
    }

}

module.exports = verifyOTP;