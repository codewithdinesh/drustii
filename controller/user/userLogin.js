const mongoose = require('mongoose');
const connConnect = require("../../config/db").conConnect;
const userModel = require('../../model/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validateEmail = require('../emailValidate');

const userlogin = (req, result, next) => {

    let email = req.body.email;
    let password = req.body.password;
    const currentDate = new Date().getTime();
    const timestamp = new Date(currentDate);

    if (!(email && password)) {
        result.status(400).send(JSON.stringify({ "message": "error: All the inputs are required", "ResponseCreated": timestamp }));

    } else {
        if (validateEmail(email) == true) {
            userModel.findOne({ email: email }, function (err, user) {
                if (err) return err;
                if (!user) return result.status(401).send({ "status": "user not found", "email": email, "ResponseCreated": timestamp });

                bcrypt.compare(password, user.password, function (err, res) {
                    if (err) return err;
                    if (res === false) {
                        return result.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": timestamp })
                    }

                    // Create token
                    const token = jwt.sign(
                        {
                            user_id: user._id
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
                        }
                    );

                    // save user token
                    user.token = token;
                    let options = {
                        path: "/",
                        sameSite: true,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true,
                    }

                    result.cookie('token_id', token, options);
                    result.status(200).send({ "status": "login success", "login_token": token, "email": email, "ResponseCreated": timestamp });
                    /* 
                    result.redirect('/');
                    */

                });

            });
        } else {
            return result.status(401).send({ "status": "Invalid Email", "email": email, "ResponseCreated": timestamp })
        }


    }


}
module.exports = userlogin;