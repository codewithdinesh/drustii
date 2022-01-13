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

    console.log("FILE ID: " + req.file._id)

    console.log(req.file);
    if (!req) {

        console.log("File not selected");
        return res.status(404).send({ "status": "File Not selected", "ResponseCreated": TimeStamp() });

        /* res.redirect("/"); */

    } else {
        const videoFileName = req.file.filename;
        const videoTitle = req.body.title;
        const videoDescription = req.body.description;
        const videoCreator = req.creator.creator_id;

        if (!(videoFileName && videoTitle && videoDescription && videoCreator)) {
            return res.status(404).send({ "status": "all the inputs are required", "ResponseCreated": TimeStamp() });

        } else {

            if (req.file.mimetype == 'video/mp4' || req.file.mimetype == 'video/x-msvideo' || req.file.mimetype == 'video/ogg' || req.file.mimetype == 'video/webm' || req.file.mimetype == 'video/mov' || req.file.mimetype == 'video/quicktime' || req.file.mimetype == '	video/3gpp' || req.file.mimetype == 'video/x-ms-wmv' || req.file.mimetype == 'application/x-mpegURL') {
                const newvideo = new VideoSchema({
                    title: videoTitle,
                    description: videoDescription,
                    source: videoFileName,
                    creator: videoCreator
                });

                newvideo.save();
                return res.status(200).send({ "status": "VIdeo Uploaded Successfully", "ResponseCreated": TimeStamp(), "videoID": newvideo._id });
            }
            else {
                return res.status(404).send({ "status": "Select proper Video Type: mp4, avi, ogg, webm, wvm, m3u8, mov", "ResponseCreated": TimeStamp() });
            }
        }
    }
}

module.exports = uploadVideo;
