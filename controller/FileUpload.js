const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const config = require("../config/config");
const conCreate = require("../config/db").conCreate;
const creatorModel = require('../model/creator');
const TimeStamp = require('./TimeStamp');

// DB
const mongoURI = config.url;


let gfs;

conCreate.once("open", () => {

  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
    bucketName: config.model,
  });

});


// Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {

      if (file) {
        const match = ["video/mp4", "video/x-msvideo", "video/ogg", "video/webm", "video/mov", "video/quicktime", "	video/3gpp", "video/x-ms-wmv", "application/x-mpegURL", "video/avi"];
        console.log()
        const videoTitle = req.body.videoTitle;
        const videoDescription = req.body.videoDescription;
        const creatorID = req.creator;
        console.log(creatorID)
        console.log(videoDescription)
        if (!videoTitle) {
          return reject("video title required");
        }
        if (!videoDescription) {
          return reject("video description required");
        }
        if (!creatorID) {
          return reject("Please Enable creator Account.")
        }

        if (match.indexOf(file.mimetype) != -1) {

          //True part
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString("hex") + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: config.model,
            };

            resolve(fileInfo);

          });

        } else {
          reject("Please Select video, Video File is required")
        }
      } else {
        reject("Video File is required")
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
