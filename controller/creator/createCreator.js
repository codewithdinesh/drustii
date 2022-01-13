const mongoose = require('mongoose');

const Fileupload = require("../FileUpload");

const conCreate = require("../../config/db").conCreate;


const connConnect = require("../../config/db").conConnect;


const creatorModel = require('../../model/creator');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const emailValidate = require('../emailValidate');

const usernameValidate = require('../userNameValidate');

const TimeStamp = require('../TimeStamp');

/* Create User */
const createCreator = async (req, res, next) => {
    var email = req.body.email;
    var pass = req.body.password;
    var retype_pass = req.body.retype_pass;
    var username = req.body.username;
    var avatar = req.body.avatar;
    var cover = req.body.cover;
    var description = req.body.description;

    try {

        if (!(email && pass && retype_pass && username && description)) {

            return res.status(400).send(JSON.stringify({ "status": "error: all the inputs are required", "ResponseCreated": TimeStamp() }));
        }
        if (emailValidate(email) == true) {
            if (pass != retype_pass) {

                return res.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": TimeStamp() })
            }
            if (usernameValidate(username) == false) {
                return res.status(401).send({ "email": email, "code": 401, "status": "Username Not valid, username should have character and numbers only", "ResponseCreated": TimeStamp() });
            }

            const exists = await creatorModel.exists({ email: email });
            const usernameExists = await creatorModel.exists({ username: username })

            if (exists) {
                res.status(409).send({ "email": email, "Code": 409, "status": "already having account", "ResponseCreated": TimeStamp() });
                // res.redirect('/login');
            } else {
                if (usernameExists) {
                    res.status(409).send({ "username": username, "Code": 409, "status": "username not available", "ResponseCreated": TimeStamp() });
                } else

                    /* Encrypting password and storing user data to database*/
                    bcrypt.genSalt(10, function (err, salt) {
                        console.log(req.body.password)
                        if (err) return next(err);
                        bcrypt.hash(req.body.password, salt, function (err, hash) {
                            console.log(hash);
                            if (err) return next(err);

                            const newCreator = new creatorModel({
                                username: username,
                                email: email,
                                password: hash,
                                description: description
                            });
                            if (avatar) {
                                newCreator.avatar = avatar;
                            }
                            if (cover) {
                                newCreator.cover = cover;
                            }

                            // Create token
                            const token = jwt.sign(
                                {
                                    creator_id: newCreator._id
                                },
                                process.env.SECRET_KEY,
                                {
                                    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)

                                }
                            );

                            // save user token
                            newCreator.token = token;
                            newCreator.save();

                            let options = {
                                path: "/",
                                sameSite: true,
                                maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                                httpOnly: true,
                            }

                            res.cookie('token_id', token, options);
                            return res.status(200).send({ "status": "account created success", "login_token": token, "email": email, "ResponseCreated": TimeStamp() });

                            // return res.redirect('/login');
                            /*  next(); */
                        });
                    });
            }


        } else {
            res.status(400).send(JSON.stringify({ "status": "invalid Email", "email": email, "ResponseCreated": TimeStamp() }));
        }
    }
    catch {
        res.status(404).send({ "status": "Something Error in Server", "ResponseCreated": TimeStamp() });
    }




}


module.exports = createCreator;
