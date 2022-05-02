const mongoose = require("mongoose");
const config = require("../../config/config");
const conCreate = require("../../config/db").conCreate;
const VideoSchema = require("../../model/video");
const connConnect = require("../../config/db").conConnect;
const creatorModel = require("../../model/creator");
const TimeStamp = require("../TimeStamp");
const crypto = require("crypto");

// AWS
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');
const multer = require('multer');

aws.config.setPromisesDependency();
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
});


s3 = new aws.S3();


const uploadVideo = async (req, res) => {

    // mov and mp4 are working 

    if (req.user) {
        if (req.creator) {

            const videoTitle = req.body.videoTitle;
            const videoDescription = req.body.videoDescription;
            const videoCreator = req.user;
            const creatorID = req.creator; // creator schema ID
            var videoCover, videoCoverParam, videoCoverSource = "https://drustii.s3.ap-south-1.amazonaws.com/videoCovers/f94b51d8-744f-4667-8a5a-8c0ef2920044.png", videofilename;


            if (!videoTitle) {
                return res.status(400).send({ "message": "Video Title is Required" });
            }

            if (!videoDescription) {
                return res.status(400).send({ "message": "Video Description is Required" });
            }

            if (!videoCreator) {
                return res.status(400).send({ "message": "Video Creator is Required" });
            }

            if (!req.files.videoSource) {
                return res.status(404).send({ message: "Video File Not Selected" });
            }

            const video = req.files.videoSource[0];

            if (!video) {
                return res.status(400).send({ "message": "Video File is Required" });
            }

            const videoKey = crypto.randomUUID();


            // videoCover
            if (req.files.videoCover) {

                videoCover = req.files.videoCover[0];
                videoCoverFileMimetype = videoCover.mimetype;

                if (videoCoverFileMimetype.startsWith("image")) {
                    const videoCoverKey = "videoCovers/" + videoKey + path.extname(videoCover.originalname);

                    videoCoverParam = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Body: fs.createReadStream(videoCover.path),
                        Key: videoCoverKey
                    }

                    videoCoverSource = videoCoverKey;

                } else {
                    return res.status(401).send({ "message": "Please Select Image File for VideoCover" });
                }
            }

            const videoMimetype = video.mimetype;

            if (videoMimetype.startsWith("video")) {

                videofilename = "videos/" + videoKey + path.extname(video.originalname);

                var videoparams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Body: fs.createReadStream(video.path),
                    Key: videofilename,
                    ACL: 'public-read',
                    ContentType: "video/mp4"
                };

                // convert file to mp4
                await s3.upload(videoparams, (err, data) => {

                    if (err) {
                        return res.staus(401).send({ "message": "Error While Uploading Video" })
                    }

                    if (data) {

                        const newVideo = new VideoSchema({
                            videoid: videofilename,
                            title: videoTitle,
                            description: videoDescription,
                            creator: videoCreator
                        });

                        // delete temp file of video

                        fs.unlink(video.path, function (err) {

                            if (err) {
                                console.error(err);
                            }
                            console.log('Temp File Delete');
                        });

                        // uploading video cover
                        if (videoCover) {



                            s3.upload(videoCoverParam, async (cover_err, cover_data) => {
                                if (cover_err) {
                                    return res.status(400).send({ "message": "error while uploading video cover, please try again" })
                                }

                            });

                            // delete temp file
                            fs.unlink(videoCover.path, function (err) {

                                if (err) {
                                    console.error(err);
                                }
                                console.log('Temp File Delete');
                            });


                        }

                        newVideo.save();

                        // updating creator videos list
                        creatorModel
                            .findOneAndUpdate(
                                { _id: creatorID },
                                {
                                    $push: { videos: newVideo._id },
                                },
                                { new: true }
                            ).exec();

                        return res
                            .status(200)
                            .send({
                                status: "Video Uploaded Successfully",
                                ResponseCreated: TimeStamp(),
                                videoID: newVideo._id,
                                creatorID: videoCreator,
                            });


                    }
                });



            } else {
                return res
                    .status(404).send({
                        "message": "Select proper Video Type: mp4, avi, ogg, webm, wvm, m3u8, mov", ResponseCreated: TimeStamp(),
                    });

            }

        } else {
            return res
                .status(404).send({
                    message: "only creator can upload the videos, Please Enable Creator Account",
                    ResponseCreated: TimeStamp(),
                });
        }
    } else {
        return res
            .status(404).send({
                message: "Please Login to upload videos",
                ResponseCreated: TimeStamp(),
            });
    }

};

module.exports = uploadVideo;
