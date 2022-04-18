const mongoose = require('mongoose');
const config = require('../../config/config');
const connConnect = require("../../config/db").conConnect;
const VideoSchema = require('../../model/video')
const TimeStamp = require('../TimeStamp');
const fs = require('fs');
const Grid = require('gridfs-stream');
const { conCreate } = require('../../config/db');
const { db } = require('../../model/video');
const formidable = require('formidable');

let gfs, gfb;
conCreate.once('open', () => {
    // Init stream

    gfb = new mongoose.mongo.GridFSBucket(conCreate.db, {
        bucketName: config.model
    });

    gfs = Grid(conCreate.db, mongoose.mongo);
    gfs.collection(config.model);
});


const videoSourceFile = (req, res) => {

    let videoId = req.params.id;
    const range = req.headers.range;


    // check videoId is empty or not
    if (!videoId) {
        return res.status(404).send({ "message": "video not found" })
    }

    VideoSchema.findOne({ source: videoId }, (err, video) => {

        if (err) {
            return res.send({ "message": "Error While Finding the video" });
        }

        if (!video) {
            return res.send({ "message": "Video not Found1" })
        }

        if (video) {

            var videoSource = new mongoose.mongo.ObjectId(video.videoid);

            gfb.find({ _id: videoSource }).toArray((err, file) => {
                if (err) {
                    return res.status(500).send({ "message": "Error in Video Fetching" })
                }

                if (file) {

                    if (file.length == 0) {
                        return res.send({ "message": "video not Found.." })
                    }

                    var contentType = file[0].contentType;
                    var file_name = file[0].filename;
                    const fileSize = file[0].length;
                    const range = req.headers.range;


                    if (range) {
                        const parts = range.replace(/bytes=/, "").split("-")
                        console.log(parts)
                        console.log(range)
                        const start = parseInt(parts[0], 10)
                        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

                        // const start = Number(range.replace(/\D/g, ""));
                        // const end = fileSize - 1;

                        if (start >= fileSize) {
                            res.status(416).send('Requested range not satisfiable \n' + start + ' >= ' + fileSize);
                            return
                        }

                        const chunksize = (end - start) + 1
                        const videoStream = gfb.openDownloadStream(videoSource, { start, end })
                        const head = {
                            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                            'Accept-Ranges': 'bytes',
                            'Content-Length': chunksize,
                            'Content-Type': 'video/mp4',
                        }

                        res.writeHead(206, head)
                        videoStream.pipe(res)

                    } else {
                        const head = {
                            'Content-Length': fileSize,
                            'Content-Type': 'video/mp4',
                        }
                        res.writeHead(200, head)
                        gfb.openDownloadStream(videoSource).pipe(res);
                    }

                }
            });
        }
    });


}

module.exports = videoSourceFile

