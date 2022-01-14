const mongoose = require('mongoose');
const connConnect = require("../../config/db").conConnect;
const userModel = require('../../model/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validateEmail = require('../emailValidate');
const TimeStamp = require('../TimeStamp');

const userlogin = (req, result, next) => {

    let email = req.body.email;
    let password = req.body.password;

    if (!(email && password)) {
        result.status(400).send(JSON.stringify({ "message": "error: All the inputs are required", "ResponseCreated": TimeStamp() }));
    } else {
        if (validateEmail(email) == true) {
            userModel.findOneAndDelete({ email: email }, function (err, user) {
                if (err) return err;
                if (!user) return result.status(401).send({ "status": "user not found", "email": email, "ResponseCreated": TimeStamp() });

                bcrypt.compare(password, user.password, function (err, res) {
                    if (err) return err;
                    if (res === false) {
                        return result.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": TimeStamp() })
                    }
                    result.status(200).send({ "status": "user account deleted Successfully", "email": email, "ResponseCreated": TimeStamp() });
                });

            });
        } else {
            return result.status(401).send({ "status": "Invalid Email", "email": email, "ResponseCreated": TimeStamp() })
        }


    }


}
module.exports = userlogin;