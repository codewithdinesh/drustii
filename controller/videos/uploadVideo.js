const mongoose = require('mongoose');
const Fileupload = require("../FileUpload");
const upload = Fileupload.upload;
const config = require('../../config/config');
const conCreate = require("../../config/db").conCreate;
const VideoSchema = require('../../model/video')
const connConnect = require("../../config/db").conConnect;
const creatorModel = require('../../model/creator');
const userModel = require('../../model/User');
const bcrypt = require("bcrypt");
const TimeStamp = require('../TimeStamp');

let gfs;

conCreate.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: config.model
    });
});



const uploadVideo = (req, res) => {

    console.log("FILE ID: "+ req.file.id)

    console.log(req.user);
    if (!req) {

        console.log("File not selected");
        return res.status(404).send({ "status": "File Not selected", "ResponseCreated": TimeStamp() });

        /* res.redirect("/"); */

    } else {
        const videoFileID = req.file.id;
        const videoTitle = req.body.title;
        const videoDescription = req.body.description;
        const videoCreator = req.user.creator_id || req.body.creator;

        if (!(videoFileID && videoTitle && videoDescription && videoCreator)) {
            return res.status(404).send({ "status": "all the inputs are required", "ResponseCreated": TimeStamp() });

        } else {
            const newvideo = new VideoSchema({
                title: videoTitle,
                description: videoDescription,
                source: videoFileID,
                creator: videoCreator
            });

            newvideo.save();

            return res.status(404).send({ "status": "VIdeo Uploaded Successfully", "ResponseCreated": TimeStamp(), "videoID": newvideo._id });

        }
    }
}

module.exports = uploadVideo;
