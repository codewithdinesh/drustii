const mongoose = require('mongoose');
const config = require('../../config/config');
const conCreate = require("../../config/db").conCreate;
const connConnect = require("../../config/db").conConnect;
const VideoSchema = require('../../model/video')
const TimeStamp = require('../TimeStamp');

const getVideo = (req, res) => {
    VideoSchema.findOne({
        _id: req.query.id
    }, (err, files) => {
        if (err) {
            return res.status(500).json({ "status": "something error while finding video", "code": 404, "ResponseCreated": TimeStamp() });
        }
        if (!files) {
            return res.status(404).json({ "status": "file not found", "code": 404, "ResponseCreated": TimeStamp() });
        }
        res.send(JSON.stringify(files, null, 1))
    });
}

module.exports = getVideo;


