const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const config = require('../config/config');
const conCreate=require("../config/db").conCreate;

// DB
const mongoURI = config.url;


// init gfs
let gfs;
conCreate.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: config.model
    });
});

// Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: config.model
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});

//exporting upload and gfs
module.exports = {
    upload
}


