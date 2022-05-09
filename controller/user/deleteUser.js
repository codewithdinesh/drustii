const mongoose = require('mongoose');
const connConnect = require("../../config/db").conConnect;
const userModel = require('../../model/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validateEmail = require('../emailValidate');
const TimeStamp = require('../TimeStamp');

var AWS = require('aws-sdk');

var s3 = new AWS.S3();


AWS.config.setPromisesDependency();
AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const userlogin = (req, result, next) => {

    let email = req.body.email;
    let password = req.body.password;

    /* Check email enterred or not */
    if (!email) {
        return res.status(400).send(JSON.stringify({ "message": "Email is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* Check password is enterred or not */
    if (!password) {
        return res.status(400).send(JSON.stringify({ "message": "Password is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    else {
        if (validateEmail(email) == true) {


            userModel.findOneAndDelete({ email: email }, function (err, user) {
                if (err) return err;
                if (!user) return result.status(401).send({ "status": "user not found", "email": email, "ResponseCreated": TimeStamp() });

                bcrypt.compare(password, user.password, function (err, res) {
                    if (err) return err;
                    if (res === false) {
                        return result.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": TimeStamp() })
                    }

                    if (user.avatar) {

                        // deleting avatar from s3
                        const param = {
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: user.avatar
                        }

                        s3.deleteObject(param, (err, data) => {
                            if (err) {
                                return res.staus(501).send({ "message": "Something Error while deleting video" });
                            }
                            console.log("avatar deleted");
                        });
                    }


                    result.status(200).send({ "status": "user account deleted Permenantly Successfully", "email": email, "ResponseCreated": TimeStamp() });
                });

            });
        } else {
            return result.status(401).send({ "status": "Invalid Email", "email": email, "ResponseCreated": TimeStamp() })
        }


    }


}
module.exports = userlogin;