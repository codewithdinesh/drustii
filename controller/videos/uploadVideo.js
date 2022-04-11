const mongoose = require("mongoose");
const Fileupload = require("../FileUpload");
const config = require("../../config/config");
const conCreate = require("../../config/db").conCreate;
const VideoSchema = require("../../model/video");
const connConnect = require("../../config/db").conConnect;
const creatorModel = require("../../model/creator");
const TimeStamp = require("../TimeStamp");

let gfs;

conCreate.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: config.model,
    });
});

const uploadVideo = (req, res) => {

    if (!req.file) {
        return res
            .status(404)
            .send({ status: "File Not selected", ResponseCreated: TimeStamp() });
        /* res.redirect("/"); */
    } else {
        if (req.user) {
            if (req.creator) {

                const videoID = req.file.id;
                const videoFileName = req.file.filename;
                const videoTitle = req.body.videoTitle;
                const videoDescription = req.body.videoDescription;
                const videoCreator = req.user;
                const videoLength = req.file.size;
                const creatorID = req.creator; // creator schema ID

               
                if (!(videoFileName && videoTitle && videoDescription && videoCreator)) {

                    return res.status(404).send({
                        "message": "video Title, video Description are Required",
                        ResponseCreated: TimeStamp(),
                    });

                } else {
                    if (
                        req.file.mimetype == "video/mp4" || req.file.mimetype == "video/x-msvideo" || req.file.mimetype == "video/ogg" ||
                        req.file.mimetype == "video/webm" || req.file.mimetype == "video/mov" || req.file.mimetype == "video/quicktime" ||
                        req.file.mimetype == "	video/3gpp" || req.file.mimetype == "video/x-ms-wmv" || req.file.mimetype == "application/x-mpegURL" ||
                        req.file.mimetype == "video/avi" || req.file.mimetype == "video/x-matroska"
                    ) {

                        VideoSchema.create({
                            videoid: videoID,
                            title: videoTitle,
                            description: videoDescription,
                            source: videoFileName,
                            length: videoLength,
                            creator: videoCreator
                        })
                            .then((dbVideo) => {

                                creatorModel
                                    .findOneAndUpdate(
                                        { _id: creatorID },
                                        {
                                            $push: { videos: dbVideo._id },
                                        },
                                        { new: true }
                                    ).exec();

                                return res.status(200).send({
                                    status: "Video Uploaded Successfully",
                                    ResponseCreated: TimeStamp(),
                                    videoID: dbVideo._id,
                                    creatorID: videoCreator,
                                });
                            }).finally((err) => {

                                if (err) {
                                    console.log("Error " + err);
                                    return res
                                        .status(404).json({ message: "Something Error Happpened" });
                                }
                            });

                    } else {
                        return res
                            .status(404).send({
                                "message": "Select proper Video Type: mp4, avi, ogg, webm, wvm, m3u8, mov", ResponseCreated: TimeStamp(),
                            });
                    }
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
    }
};

module.exports = uploadVideo;
