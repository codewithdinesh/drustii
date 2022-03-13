const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const config = require("../../config/config");
const conCreate = require("../../config/db").conCreate;
const creatorModel = require('../../model/creator');
const TimeStamp = require('../TimeStamp');

// DB
const mongoURI = config.url;


let gfs;

conCreate.once("open", () => {

    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: "avatar",
    });

});


// Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {

            if (file) {
                const match = ["image/bmp", "image/gif", "image/jpeg", "image/pipeg", "image/png"];

                if (match.indexOf(file.mimetype) != -1) {

                    //True part
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString("hex") + path.extname(file.originalname);
                        const fileInfo = {
                            filename: filename,
                            bucketName: "avatar",
                        };

                        resolve(fileInfo);

                    });

                } else {
                    // reject("Please Select video, Video File is required")
                }
            } else {
                // reject("Video File is required")
            }
        });

    },
});

const upload = multer({
    storage,
    limits: 10000
});

//exporting upload and gfs
module.exports = {
    upload,
};
