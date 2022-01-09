const mongoose = require('mongoose');

const Fileupload = require("../FileUpload");

const conCreate = require("../../config/db").conCreate;


const connConnect = require("../../config/db").conConnect;


const userModel = require('../../model/User');

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken');

const userlogin = (req, result) => {

    let email = req.body.email;
    let password = req.body.password;

    userModel.findOne({ email: email }, function (err, user) {
        if (err) return err;
        if (!user) return result.send("err");

        bcrypt.compare(password, user.password, function (err, res) {
            if (err) return err;
            if (res === false) {
                return console.log("password not match");
            }
            console.log("Success");
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                "TOKEN_KEY",
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;
            let options = {
                path:"/",
                sameSite:true,
                maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                httpOnly: true, // The cookie only accessible by the web server
            }
        
            result.cookie('access_token',token, options) 
            result.redirect('/');
        });

    });
}
module.exports = userlogin;