const VideoSchema = require("../../model/video");

const creatorModel = require("../../model/creator");
const TimeStamp = require("../TimeStamp");
const crypto = require("crypto");

// AWS
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');

const validateEmail = require("../emailValidate");
const Views = require("../../model/Views");
const likes = require("../../model/likes");

ffmpeg.setFfmpegPath(ffmpegPath);

aws.config.setPromisesDependency();
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
});


s3 = new aws.S3();


const uploadVideo = async (req, res) => {

    // console.log(req.body)
    //console.log(req.files)

    // mov and mp4 are working 

    if (req.user) {
        if (req.creator) {

            const videoTitle = req.body.videoTitle;

            const videoDescription = req.body.videoDescription;

            // public , private or shareonly
            const videoPrivacy = req.body.videoPrivacy;

            const videoCategory = req.body.videoCategory;

            // if video is share only
            let videoReadPermission = req.body.videoReadPermission;

            let share_only_user;

            const videoCreator = req.user;

            const creatorID = req.creator; // creator schema ID


            // videoSourceCover have default  image if videoCover not selected

            var videoCover, videoCoverParam, videoCoverSource = "", videofilename, videoCoverFileName;
            let videoCoverKey;


            if (!videoTitle) {
                return res.status(404).send({ "message": "Video Title is Required" });
            }

            if (!videoDescription) {
                return res.status(404).send({ "message": "Video Description is Required" });
            }

            if (!videoCreator) {
                return res.status(404).send({ "message": "Video Creator is Required" });
            }

            if (!req.files.videoSource) {
                return res.status(404).send({ message: "Video File Not Selected" });
            }


            const video = req.files.videoSource[0];

            if (!video) {
                return res.status(404).send({ "message": "Video File is Required" });
            }


            if (videoPrivacy == "shareonly") {

                if (!videoReadPermission) {

                    return res.status(404).send({ "message": "please specify user to access user video " })

                } else {

                    videoReadPermission = videoReadPermission.replace(/\s+/g, ' ');

                    videoReadPermission = videoReadPermission.toLowerCase().replace(/\s+/g, "");

                    videoReadPermission = videoReadPermission + "," + req.user_email;

                    share_only_user = videoReadPermission.split(",");

                    let i = 0;
                    for (i; i < share_only_user.length; i++) {

                        if (validateEmail(share_only_user[i]) == false) {

                            return res.status(404).send({ "message": "Email to provide to access are invalid" });

                        }

                    }
                }
            }

            const videoKey = crypto.randomUUID();


            // videoCover
            if (req.files.videoCover) {

                videoCover = req.files.videoCover[0];
                videoCoverFileName = videoCover.path;
                videoCoverFileMimetype = videoCover.mimetype;

                if (videoCoverFileMimetype.startsWith("image")) {

                    videoCoverKey = "videoCovers/" + videoKey + path.extname(videoCover.originalname);

                    videoCoverParam = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Body: fs.createReadStream(videoCover.path),
                        Key: videoCoverKey,
                        ACL: 'public-read',
                        ContentType: "image/png"
                    }

                    videoCoverSource = videoCoverKey;

                } else {
                    return res.status(415).send({ "message": "Please Select Image File for VideoCover" });
                }
            }

            const videoMimetype = video.mimetype;

            if (videoMimetype.startsWith("video")) {


                // compress video or change video format of video to .mp4 before uploding using ffmgpe

                videofilename = "temp/videos/" + videoKey + ".mp4";

                await new Promise((resolve, reject) => {

                    ffmpeg(video.path).videoCodec("libx264").size('720x?').withAspect('16:9').saveToFile(videofilename).on("start", (err) => {

                    }).on("error", (err) => {
                        res.status(401).send({ "message": "Error accure durinig video convert" })
                        reject();

                    }).on("end", (data) => {
                        console.log("video converted");
                        resolve();
                    });
                    return;
                });


                // detele temp video file
                fs.unlink(video.path, function (err) {

                    if (err) {
                        console.error(err);
                    }

                });


                // videoKey
                const videofileKey = "videos/" + videoKey + ".mp4";

                var videoparams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Body: fs.createReadStream(videofilename),
                    Key: videofileKey,
                    ACL: 'public-read',
                    ContentType: "video/mp4"
                };


                if (!videoCover) {

                    const videoCoverFileNameLocal = videoKey + ".png";

                    videoCoverFileName = "temp/" + videoKey + ".png";

                    videoCoverKey = "videoCovers/" + videoKey + ".png";


                    await new Promise((resolve, reject) => {

                        ffmpeg(videofilename)
                            .setFfmpegPath(ffmpeg_static)
                            .screenshots(
                                {
                                    timestamps: [0.3],
                                    count: 1,
                                    folder: "temp/",
                                    filename: videoCoverFileNameLocal,
                                    size: "1280x720"
                                }
                            ).on("start", (err) => {

                            }).on("error", (err) => {

                                res.status(401).send({ "message": "error while Generating video Thumbnail" })
                                reject();

                            }).on("end", (data) => {

                                resolve();
                            })

                    });

                    videoCoverParam = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Body: fs.createReadStream(videoCoverFileName),
                        Key: videoCoverKey,
                        ACL: 'public-read',
                        ContentType: "image/png"
                    }
                }
                try {


                    // convert file to mp4
                    await s3.upload(videoparams, async (err, data) => {

                        if (err) {
                            return res.staus(401).send({ "message": "Error While Uploading Video" })
                        }

                        if (data) {
                            let videoUploadedOn = new Date().toLocaleString();

                            const newVideo = new VideoSchema({
                                videoid: videofileKey,
                                title: videoTitle,
                                description: videoDescription,
                                creator: videoCreator,
                                videoCover: videoCoverKey,
                                videoCategory,
                                uploadOn: videoUploadedOn
                            });

                            if (videoPrivacy == "private") {

                                newVideo.privacy = {
                                    privacy: "private"
                                }

                            } else if (videoPrivacy == "shareonly") {

                                newVideo.privacy = {
                                    privacy: "shareonly",

                                    "user": share_only_user
                                }
                            }
                            else {

                                newVideo.privacy = {
                                    privacy: "public"
                                }


                            }


                            // uploading video cover
                            s3.upload(videoCoverParam, async (cover_err, cover_data) => {

                                if (cover_err) {
                                    return res.status(400).send({ "message": "error while uploading video cover, please try again" })
                                }
                                console.log("upload done videocover")

                            });

                            // deteting converted video file
                            fs.unlink(videofilename, (err) => {
                                if (err) {
                                    console.log("Error while deleting Temp file")
                                }

                            });

                            // delete temp file
                            fs.unlink(videoCoverFileName, function (err) {

                                if (err) {
                                    console.error(err);
                                }
                                console.log('Temp File Delete');
                            });

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

                            const newViews = Views({
                                _id: newVideo._id,
                                Views: 0
                            });

                            const newLikes = likes({
                                _id: newVideo._id,
                                likes: 0

                            });

                            newLikes.save();
                            newViews.save();

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
                } catch {
                    return res
                        .status(501).send({
                            "message": "Something went wrong", ResponseCreated: TimeStamp(),
                        });

                }

            } else {
                return res
                    .status(408).send({
                        "message": "Select proper Video Type: mp4, avi, ogg, webm, wvm, m3u8, mov", ResponseCreated: TimeStamp(),
                    });

            }

        } else {
            return res
                .status(401).send({
                    message: "only creator can upload the videos, Please Enable Creator Account",
                    ResponseCreated: TimeStamp(),
                });
        }
    } else {
        return res
            .status(401).send({
                message: "Please Login to upload videos",
                ResponseCreated: TimeStamp(),
            });
    }

};

module.exports = uploadVideo;
