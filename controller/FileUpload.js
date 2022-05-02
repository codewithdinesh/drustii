// const crypto = require("crypto");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const config = require("../config/config");
// const conCreate = require("../config/db").conCreate;
// const creatorModel = require('../model/creator');


// const path = require('path');
// const fs = require('fs');
// const aws = require('aws-sdk');
// const multerS3 = require('multer-s3');


// aws.config.setPromisesDependency();
// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });


// s3 = new aws.S3();


// var params = {
//   ACL: 'public-read',
//   Bucket: process.env.BUCKET_NAME,
//   Body: fs.createReadStream(req.file.path),
//   Key: `userAvatar/${req.file.originalname}`
// };


// s3.upload(params, (err, data) => {
//   if (err) {
//     console.log('Error occured while trying to upload to S3 bucket', err);
//   }

//   if (data) {
//     console.log("File uploaded at ", data.location);
//   }
// }


// // Storage
// // const storage1 = new GridFsStorage({
// //   url: mongoURI,
// //   file: (req, file) => {
// //     return new Promise((resolve, reject) => {

// //       if (file) {
// //         const match = ["video/mp4", "video/x-msvideo", "video/x-matroska", "video/ogg", "video/webm", "video/mov", "video/quicktime", "	video/3gpp", "video/x-ms-wmv", "application/x-mpegURL", "video/avi"];

// //         const videoTitle = req.body.videoTitle;
// //         const videoDescription = req.body.videoDescription;
// //         const creatorID = req.creator;

// //         if (!videoTitle) {
// //           return reject("video title required");
// //         }
// //         if (!videoDescription) {
// //           return reject("video description required");
// //         }
// //         if (!creatorID) {
// //           return reject("Please Enable creator Account.")
// //         }

// //         if (match.indexOf(file.mimetype) != -1) {

// //           //True part
// //           crypto.randomBytes(16, (err, buf) => {
// //             if (err) {
// //               return reject(err);
// //             }
// //             const filename = buf.toString("hex") + path.extname(file.originalname);
// //             const fileInfo = {
// //               filename: filename,
// //               bucketName: config.model,
// //             };

// //             resolve(fileInfo);

// //           });

// //         } else {
// //           reject("Please Select video, Video File is required")
// //         }
// //       } else {
// //         reject("Video File is required")
// //       }
// //     });

// //   },
// // });

// // const upload = multer({
// //   storage,
// //   limits: 10000
// // });

// //exporting upload and gfs
// // module.exports = {
// //   upload,
// // };
