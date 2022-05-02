const mongoose = require('mongoose');
const config = require('../../config/config');
const conCreate = require("../../config/db").conCreate;
const connConnect = require("../../config/db").conConnect;
const VideoSchema = require('../../model/video')
const TimeStamp = require('../TimeStamp');
let gfs;

conCreate.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: config.model
    });
});

const getVideos = (req, res) => {
    VideoSchema.find({"privacy":"public"}, (err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: "no files exist"
            });
        }
       // console.log(JSON.stringify(files, null, "  "));
        res.send(JSON.stringify(files, null, 1))
    });
}

module.exports = getVideos;


