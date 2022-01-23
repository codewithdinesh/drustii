
const Creator = require('../../model/creator');
const VideoSchema = require('../../model/video')
const TimeStamp = require('../TimeStamp');
const config = require('../../config/config');
const conCreate = require("../../config/db").conCreate;
const connConnect = require("../../config/db").conConnect;
const mongoose = require('mongoose');

const deleteVideo = (req, res) => {
    let creator_id=req.creator;
    if (!req) {
        res.json({ "message": "video id not mentioned" })
    } else {
      
        VideoSchema.findOneAndDelete({
            _id: req.query.id
        }, (err, files) => {
            console.log(creator_id);
            if (err) {
                return res.status(500).json({ "status": "something error while feching video", "code": 500, "ResponseCreated": TimeStamp() });
            }

            if (!files) {
                return res.status(404).json({ "status": "file not found", "code": 404, "ResponseCreated": TimeStamp() });
            }
            if (files) {
                console.log(files)
                Creator.updateOne({ _id: files.creator }, { $pull: { videos: req.query.id } }).exec().catch(console.log("Ok deleted"))
                return res.status(200).send({ "message": "video successfully deleted", "code": 200, "ResponseCreated": TimeStamp() });

            }

        });

    }
}


module.exports = deleteVideo;


