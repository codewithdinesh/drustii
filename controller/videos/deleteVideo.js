
const VideoSchema = require('../../model/video')
const TimeStamp = require('../TimeStamp');

const deleteVideo = (req, res) => {
    VideoSchema.findOneAndDelete({
        _id: req.query.id
    }, (err, files) => {
        if (err) {
            return res.status(500).json({ "status": "something error while feching video", "code": 500, "ResponseCreated": TimeStamp() });
        }

        if (!files) {
            return res.status(404).json({ "status": "file not found", "code": 404, "ResponseCreated": TimeStamp() });
        }
        if (files) {
            console.log(files)
            return res.status(200).send({ "message": "video successfully deleted", "code": 200, "ResponseCreated": TimeStamp() });
        }

    });
}

module.exports = deleteVideo;


