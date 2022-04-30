const mongoose = require('mongoose');

const Fileupload = require("../FileUpload");

const conCreate = require("../../config/db").conCreate;

const connConnect = require("../../config/db").conConnect;

const userModel = require('../../model/User');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const emailValidate = require('../emailValidate');

const userNamevalidate = require("../userNameValidate");
const verifiedUsers = require('../../model/verifiedUsers');

/* Create Normal User */
const createUser = async (req, res, next) => {
    console.log(req.body)
    var email = req.body.email;
    var pass = req.body.pass;
    var retype_pass = req.body.retype_pass;
    var username = req.body.username;
    var name = req.body.name;
    var avatar;
    if (req.file) {
        avatar = req.file.id;
    }

    var dob = req.body.dob;
    var gender = req.body.gender;

    const currentDate = new Date().getTime();
    const timestamp = new Date(currentDate);

    /* Check email enterred or not */
    if (!email) {
        return res.status(400).send(JSON.stringify({ "message": "Email is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* Check password is enterred or not */
    if (!pass) {
        return res.status(400).send(JSON.stringify({ "message": "Password is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* Check retype_pass */
    if (!retype_pass) {
        return res.status(400).send(JSON.stringify({ "message": "Retype Password  Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* Check username is enterred or not */
    if (!username) {
        return res.status(400).send(JSON.stringify({ "message": "username is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* Check DOB  */
    if (!dob) {
        return res.status(400).send(JSON.stringify({ "message": "DOB is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* check name */
    if (!name) {
        return res.status(400).send(JSON.stringify({ "message": "Name is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    if (emailValidate(email) == true) {

        if (pass != retype_pass) {

            return res.status(401).send({ "message": "password does not match", "status": 401, "email": email, "ResponseCreated": timestamp })
        }

        const exists = await userModel.exists({ email: email });
        const verfiedUser = await verifiedUsers.exists({ email: email })

        if (verfiedUser) {

            /*   check username format */

            if (userNamevalidate(username) == true) {


                const userNameExists = await userModel.exists({ username: username });

                if (exists) {

                    return res.status(409).send({ "email": email, "status": 409, "message": "already having account", "ResponseCreated": timestamp });

                    // res.redirect('/login');

                } else {



                    if (!userNameExists) {

                        /* Encrypting password and storing user data to database*/

                        bcrypt.genSalt(10, function (err, salt) {

                            if (err) return next(err);
                            bcrypt.hash(pass, salt, function (err, hash) {

                                if (err) return next(err);

                                const newUser = new userModel({
                                    email: email,
                                    password: hash,
                                    username: username,
                                    name: name,
                                    dob: dob
                                });

                                if (avatar) {
                                    newUser.avatar = avatar;
                                }
                                if (gender) {
                                    newUser.gender = gender;
                                }

                                /* Create token */
                                const token = jwt.sign(
                                    {
                                        user_id: newUser._id
                                    },
                                    process.env.SECRET_KEY,
                                    {
                                        expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)

                                    }
                                );

                                /* save user token */
                                newUser.token = token;
                                newUser.save();

                                let options = {
                                    path: "/",
                                    sameSite: true,
                                    maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                                    httpOnly: true,
                                }

                                res.cookie('token_id', token, options);
                                return res.status(200).send({ "message": "account created successfully", "status": 200, "login_token": token, "email": email, "ResponseCreated": timestamp });

                                // return res.redirect('/login');
                                /*  next(); */
                            });
                        });
                    }

                    else {

                        return res.status(400).send(JSON.stringify({ "message": "username not available", "status": 400, "ResponseCreated": timestamp }));

                    }
                }
            }
            else {
                return res.status(400).send(JSON.stringify({ "message": "username is invalid", "status": 400, "ResponseCreated": timestamp }));
            }
        } else {
            return res.status(400).send(JSON.stringify({ "message": "Please verify your Email to create account", "status": 400, "ResponseCreated": timestamp }));

        }
    }

    else {

        return res.status(400).send(JSON.stringify({ "message": "invalid Email", "status": 400, "email": email, "ResponseCreated": timestamp }));

    }
}




module.exports = createUser;
