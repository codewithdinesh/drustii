const mongoose = require('mongoose');
const config = require('../../config/config');
const conCreate = require("../../config/db").conCreate;
const connConnect = require("../../config/db").conConnect;
const VideoSchema = require('../../model/video')
const TimeStamp = require('../TimeStamp');
const request = require("request")

const getVideo = (req, res) => {
    VideoSchema.findOne({
        _id: req.query.id
    },
        (err, files) => {
            if (err) {
                return res.status(500).json({ "message": "something error while finding video", "code": 404, "ResponseCreated": TimeStamp() });
            }
            if (!files) {
                return res.status(404).json({ "message": "video not found", "code": 404, "ResponseCreated": TimeStamp() });
            }
            res.send({ files, "source": `http://localhost:5001/v/${files.videoid}` })
        });
}

module.exports = getVideo;


