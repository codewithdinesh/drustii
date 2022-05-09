const connConnect = require("../../config/db").conConnect;

const userModel = require('../../model/User');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const emailValidate = require('../emailValidate');

const userNamevalidate = require("../userNameValidate");

const verifiedUsers = require('../../model/verifiedUsers');
const crypto = require("crypto");

// AWS
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');
const multer = require('multer');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

aws.config.setPromisesDependency();
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
});



/* Create Normal User */
const createUser = async (req, res, next) => {

    console.log(req.body)
    console.log(req.file)

    var email = req.body.email;
    var pass = req.body.pass;
    var retype_pass = req.body.retype_pass;
    var username = req.body.username;
    var name = req.body.name;
    var avatarPath;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var avatarKey, avatarFileName, avatarParam;
    var avatarFile;

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



    if (req.file) {
        avatarFile = req.file;
        var avatarFileMimeType = avatarFile.mimetype;
        avatarKey = crypto.randomUUID();

        if (avatarFileMimeType.startsWith("image")) {

            avatarPath = avatarFile.originalname;

            avatarFileName = "avatar/" + avatarKey + path.extname(avatarPath);

            avatarParam = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: fs.createReadStream(avatarFile.path),
                Key: avatarFileName,
                ACL: 'public-read',
                ContentType: "image/png"
            }

        } else {

            return res.status(401).send({ "message": "please select avatar file as image file" });

        }
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

                                if (avatarPath) {

                                }

                                const newUser = new userModel({
                                    email: email,
                                    password: hash,
                                    username: username,
                                    name: name,
                                    dob: dob
                                });

                                // uploading avatar
                                if (avatarFileName) {
                                    newUser.avatar = avatarFileName;

                                    s3.upload(avatarParam, (err, response) => {
                                        if (err) {
                                            console.log("Error while uploading Avatar")
                                        }

                                    });

                                    fs.unlink(avatarFile.path, (err) => {
                                        if (err) {
                                            console.log("error")
                                        }
                                        console.log("Temp file deleted")
                                    })
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
