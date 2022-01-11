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


//upload
const uploadPage = (req, res) => {
    if (!req.id) {

        console.log("File not selected");
        res.redirect("/");

    } else {


        console.log(req.file.id);

        const video = new VideoSchema({
            source: req.file.id,
            title: req.file.filename,
            description: "This is description",
        });

        video.save(video)
            .then(data => {
                res.send(data);
                console.log("Data :" + data)
            })
            .catch(err => {
                console.log("Error" + err)

            });
        res.redirect("/");
    }
}


const createCreator = async (req, res) => {

    const exists = await Creator.exists({ username: req.body.username });
    console.log(exists);
    console.log(req.body.username);

    if (exists) {
        res.redirect('/login');
        return;
    };

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) return next(err);

            const newCreator = new creatorModel({

                username: req.body.username,
                password: hash,
                email: req.body.email,
                description: req.body.description,
                avatar: req.body.avatar,
                cover: req.body.cover

            });
            newCreator.save();
            res.redirect('/login');
        });
    });
}




const loginPage = (req, res) => {
    res.render('login');

}

module.exports = {

    homePage,
    uploadPage,
    loginPage,
    createCreator,
    videos: (req, res) => {
        gfs.find().toArray((err, files) => {
            // check if files
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            console.log(JSON.stringify(files, null, "  "));
            res.send(JSON.stringify(files, null, 1))
        });
    },

    getVideo: (req, res) => {
        gfs.find(
            {
                filename: req.params.filename
            },
            (err, file) => {
                if (!file) {
                    return res.status(404).json({
                        err: "no files exist"
                    });
                }
                return res.json(file);
            }
        );
    },

    deleteVideo: (req, res) => {
        gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
            if (err) return res.status(404).json({ err: err.message });
            res.redirect("/");
        });
    }

}
