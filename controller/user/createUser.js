const mongoose = require('mongoose');
const Fileupload = require("../FileUpload");
/* const upload = Fileupload.upload;
const config = require('../../config/config'); */
const conCreate = require("../../config/db").conCreate;
/* const VideoSchema = require('../../model/video') */
const connConnect = require("../../config/db").conConnect;
/* const creatorModel = require('../../model/creator'); */
const userModel = require('../../model/User');
const bcrypt = require("bcrypt");

/* Create Normal User */
const createUser = async (req, res, next) => {

    const exists = await userModel.exists({ username: req.body.username });
    console.log(exists);
    console.log(req.body.username);

    if (exists) {
        res.redirect('/login');
        return;
    };

    bcrypt.genSalt(10, function (err, salt) {
        console.log(req.body.password)
        if (err) return next(err);
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            console.log(hash);
            if (err) return next(err);

            const newUser = new userModel({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                avatar: req.body.avatar
            });

            newUser.save();
            res.redirect('/login');
        });
    });
}


module.exports = {
    createUser
}