const mongoose = require('mongoose');
const Fileupload = require("../FileUpload");
const config = require('../../config/config');
const conCreate = require("../../config/db").conCreate;
const VideoSchema = require('../../model/video')
const connConnect = require("../../config/db").conConnect;
const creatorModel = require('../../model/creator');
const TimeStamp = require('../TimeStamp');

let gfs;

conCreate.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: config.model
    });
});



const uploadVideo = (req, res) => {
    console.log(req.file);
    if (!req.file) {
        console.log("File not selected");
        return res.status(404).send({ "status": "File Not selected", "ResponseCreated": TimeStamp() });
        /* res.redirect("/"); */
    } else {

        if (req.creator) {
            const videoFileName = req.file.filename;
            const videoTitle = req.body.title;
            const videoDescription = req.body.description;
            const videoCreator = req.creator.creator_id;

            if (!(videoFileName && videoTitle && videoDescription && videoCreator)) {
                return res.status(404).send({ "status": "all the inputs are required", "ResponseCreated": TimeStamp() });

            } else {

                if (req.file.mimetype == 'video/mp4' || req.file.mimetype == 'video/x-msvideo' || req.file.mimetype == 'video/ogg' || req.file.mimetype == 'video/webm' || req.file.mimetype == 'video/mov' || req.file.mimetype == 'video/quicktime' || req.file.mimetype == '	video/3gpp' || req.file.mimetype == 'video/x-ms-wmv' || req.file.mimetype == 'application/x-mpegURL' || req.file.mimetype == 'video/avi') {

                    /*  const newvideo = new VideoSchema({
                         title: videoTitle,
                         description: videoDescription,
                         source: videoFileName,
                         creator: videoCreator
                     });
                     newvideo.save();
 
                     creatorModel.findOneAndUpdate({ _id: videoCreator }).populate('videos').exec((video) => {
                         console.log(video);
                     }) */

                    VideoSchema.create({
                        title: videoTitle,
                        description: videoDescription,
                        source: videoFileName,
                        creator: videoCreator
                    }).then((dbVideo) => {
                        console.log(dbVideo._id);
                        console.log(videoCreator);
                        creatorModel.findOneAndUpdate({ _id: videoCreator }, {
                            $push: { videos: dbVideo._id }
                        },
                            { new: true }
                        ).exec();
                        return res.status(200).send({ "status": "VIdeo Uploaded Successfully", "ResponseCreated": TimeStamp(), "videoID": dbVideo._id, "creatorID": videoCreator });
                    }).finally(err => {
                        if (err) {
                            console.log("Error " + err);
                            return res.status(404).json({ "message": "Something Error Happpened" });
                        }
                    });
                }
                else {
                    return res.status(404).send({ "status": "Select proper Video Type: mp4, avi, ogg, webm, wvm, m3u8, mov", "ResponseCreated": TimeStamp() });
                }

            }
        }
        else {
            return res.status(404).send({ "message": "only creator can upload the videos", "ResponseCreated": TimeStamp() })
        }
    }
}

module.exports = uploadVideo;