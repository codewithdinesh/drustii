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


const Creator = new creatorModel();
const User = new userModel();
let gfs;

conCreate.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: config.model
    });
});


//home page
const homePage = (req, res) => {
    if (!gfs) {
        console.log("some error occured, check connection to db");
        res.send("some error occured, check connection to db");
        process.exit(0);
    }
    gfs.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.render("index", {
                files: false
            });
        } else {
            const f = files
                .map(file => {
                    if (
                        file.contentType === "video/mp4"
                    ) {
                        file.isImage = true;
                    } else {
                        file.isImage = false;
                    }
                    return file;
                })
                .sort((a, b) => {
                    return (
                        new Date(b["uploadDate"]).getTime() -
                        new Date(a["uploadDate"]).getTime()
                    );
                });

            return res.render("index", {
                files: f
            });
        }

        // return res.json(files);
    });

}

const loginPage = (req, res) => {
    res.render('login');
}

module.exports = {
    homePage,
    loginPage
}
