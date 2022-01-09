const mongoose = require('mongoose');
const Fileupload = require("./FileUpload");
const upload = Fileupload.upload;
const config = require('../config/config');
const conCreate = require("../config/db").conCreate;
const VideoSchema = require('../model/video')
const connConnect = require("../config/db").conConnect;
const creatorModel = require('../model/creator');
const userModel = require('../model/User');
const bcrypt = require("bcrypt");

const userlogin = (req, result) => {

    let username = req.body.email;
    let password = req.body.password;


    userModel.findOne({ email: username }, function (err, user) {
        if (err) return err;
        if (!user) return result.send("err");

        bcrypt.compare(password, user.password, function (err, res) {
            if (err) return err;
            if (res === false) {
                return console.log("password not match");
            }
            console.log("Success")
            result.redirect('/');
        });

    });
}
