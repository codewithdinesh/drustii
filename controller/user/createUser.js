const mongoose = require('mongoose');

const Fileupload = require("../FileUpload");

const conCreate = require("../../config/db").conCreate;


const connConnect = require("../../config/db").conConnect;


const userModel = require('../../model/User');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const emailValidate = require('../emailValidate');

/* Create Normal User */
const createUser = async (req, res, next) => {
    var email = req.body.email;
    var pass = req.body.password;
    var retype_pass = req.body.retype_pass;
    var username = req.body.username;
    var avatar = req.body.avatar;
    const currentDate = new Date().getTime();
    const timestamp = new Date(currentDate);



    if (!(email && pass && retype_pass && username)) {

        res.status(400).send(JSON.stringify({ "status": "error: all the inputs are required", "email": email, "ResponseCreated": timestamp }));
    }
    if (emailValidate(email) == true) {
        if (pass != retype_pass) {

            return res.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": timestamp })
        }

        const exists = await userModel.exists({ email: email });

        if (exists) {
            res.status(409).send({ "email": email, "Code": 409, "status": "already having account", "ResponseCreated": timestamp });
            // res.redirect('/login');
        } else {

            /* Encrypting password and storing user data to database*/
            bcrypt.genSalt(10, function (err, salt) {
                console.log(req.body.password)
                if (err) return next(err);
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    console.log(hash);
                    if (err) return next(err);

                    const newUser = new userModel({
                        username: username,
                        password: hash,
                        email: email
                    });
                    if (avatar) {
                        newUser.avatar = avatar;
                    }
                    // Create token
                    const token = jwt.sign(
                        {
                            user_id: newUser._id
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)

                        }
                    );

                    // save user token
                    newUser.token = token;
                    newUser.save();

                    let options = {
                        path: "/",
                        sameSite: true,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true,
                    }

                    res.cookie('token_id', token, options);
                    return res.status(200).send({ "status": "account created success", "login_token": token, "email": email, "ResponseCreated": timestamp });

                    // return res.redirect('/login');
                    /*  next(); */
                });
            });
        }
    } else {
        res.status(400).send(JSON.stringify({ "status": "invalid Email", "email": email, "ResponseCreated": timestamp }));
    }


}


module.exports = createUser;
