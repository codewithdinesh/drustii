const mongoose = require('mongoose');

const Fileupload = require("../FileUpload");

const conCreate = require("../../config/db").conCreate;


const connConnect = require("../../config/db").conConnect;


const userModel = require('../../model/User');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

/* Create Normal User */
const createUser = async (req, res, next) => {
    var email = req.body.email;
    var pass = req.body.password;
    var retype_pass = req.body.retype_pass;
    var username = req.body.username;
    var avatar = req.body.avatar;


    if (!(email && pass && retype_pass && username)) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ "Err": "All the inputs are required" }));
    }
    if (pass != retype_pass) {
        return res.end(JSON.stringify(
            { "Err": "Password not match" }));
    }

    const exists = await userModel.exists({ email: email });
    console.log("Exists: " + exists);


    if (exists) {
        res.end(JSON.stringify({ "email": email, "Code": 409, "status": "already having account" }));
        // res.redirect('/login');
        return;
    };

    bcrypt.genSalt(10, function (err, salt) {
        console.log(req.body.password)
        if (err) return next(err);
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            console.log(hash);
            if (err) return next(err);

            const newUser = new userModel({
                username: username,
                password: hash,
                email: email,
                avatar: avatar
            });
            // Create token
            const token = jwt.sign(
                { user_id: newUser._id, email },
                "TOKEN_KEY",
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            newUser.token = token;

            newUser.save();
            console.log(token);
            res.setHeader('Content-Type', 'application/json');
            res.json({ "email": email, "Code": 200, "status": "Account Created" });
            res.redirect('/login');
        });
    });
}


module.exports = {
    createUser
}