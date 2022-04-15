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


const videoHost = (req, res) => {
    let videoId = req.params.id;
    const range = req.headers.range;


    // form getting
    // var formData=new formidable.parsers()

    // check videoId is empty or not
    if (!videoId) {
        return res.status(404).send({ "message": "video not found" })

    } else {



        VideoSchema.findOne({ _id: videoId }, (err, video) => {

            if (err) {
                res.send({ "message": "Error While Finding the video" });
            }

            if (!video) {
                return res.send({ "message": "Video not Found1" })
            }

            if (video) {

                var videoSource = new mongoose.mongo.ObjectId(video.videoid);

                // console.log(videoSource)

                gfb.find({ _id: videoSource }).toArray((err, file) => {
                    if (err) {
                        return err;
                    }

                    if (file) {

                        if (file.length == 0) {
                            return res.send({ "message": "Video not Found2" })
                        }

                        var downloadStream = gfb.openDownloadStream(videoSource);

                        res.set('Content-Type', file[0].contentType)

                        res.set('Content-Disposition', 'attachment; filename="' + file[0].filename + '"');

                        downloadStream.pipe(res)

                        // var readStream = gfs.createReadStream({
                        //     _id: videoSource
                        // }).on('open', function () {
                        //     console.log("start..");

                        // }).on('data', function (chunk) {

                        //     console.log('loading..');
                        //     //loading...

                        // }).on("end", function () {

                        //     console.log("ready");
                        //     //loaded :)

                        // }).on('error', function (err) {

                        //     res.send(404);//no found :(
                        //     console.log(err);

                        // });

                        // readStream.pipe(res);

                    }
                });
            }
        });




    }
}

module.exports = videoHost

// const videoSize = files[0].length;
// const videoFile = files[0];

// console.log("videoSize:", videoSize)

// const CHUNK_SIZE = 10 ** 6;
// const start = Number(range.replace(/\D/g, ""));
// const end = videoSize-1;
// const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
// console.log(end)
// const contentLength = end - start + 1;

// if (!range) {
//     return res.send({ message: "something error" })
// }
// console.log(range)

// var parts = range.replace(/bytes=/, "").split("-");
// var partialstart = parts[0];
// var partialend = parts[1];
// var start = parseInt(partialstart, 10);

// var end = partialend ? parseInt(partialend, 10) : videoSize - 1;
// var chunksize = (end - start) + 1;

// console.log('Range ', start, '-', end);

// const headers = {
//     "Content-disposition": "video",
//     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": chunksize,
//     "Content-Type": videoFile.contentType,

// };

// res.writeHead(206, headers);

// videoFile.seek(start, () => {
//     stream = videoFile.stream(true);

// });


// const stream = gfs.openDownloadStream(files._id);

// stream.start(1024 * 1585);
// stream.pipe(fs.createWriteStream('../../output.avi'));


// // stream.on('data', data => {
// //     res.send(data)
// // });

// stream.on('error', error => {
//     res.send({"message":"Something Error Happened"})

// });

// stream.on('end', () => {
//     console.log("Done");
//     process.exit(0)
// });




// conCreate.once("open", () => {

//     gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {

//         bucketName: config.model
//     });
// });


// gfs.find({ _id: videoId }).toArray((err, file) => {
//     if (err) {
//         return res.status(500).send({ "message": "Something went erong in server.." })
//     }

//     if (!file) {
//         return res.status(404).send({ "message": "File not found" })
//     }

//     if (file) {
//         res.set('Content-Type', file[0].contentType)
//         res.set('Content-Disposition', 'attachment; filename="' + file[0].filename + '"');

//         var readStream = gfs.createReadStream({
//             _id: videoId
//         });

//         readStream.on('error', (err) => {
//             res.end();
//         })

//         readStream.pipe(res)
//     }
// })


// var gfs = Grid(conCreate, mongoose.mongo);
// finding video file
// gfs.findOne({ _id: videoId, root: 'video' }, function (err, file) {
//     if (err) {
//         console.log(err)
//         return res.status(400).send({ "message": "Error while finding video" });
//     }
//     else if (!file) {
//         return res.status(404).send('Error on the database looking for the file.');
//     }

//     console.log("running")

//     res.set('Content-Type', file.contentType);
//     res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

//     var readstream = gfs.createReadStream({
//         _id: videoId,
//         root: config.model
//     });

//     readstream.on("error", function (err) {
//         res.end({ "message": "Error" });
//     });

//     readstream.pipe(res);
// });



// db.collection(config.model+".files")
// gfs.findOne({ _id: videoId, 'root': config.model }, function (err, file) {
//     console.log(file)

//     if (err) {
//         console.log("Error")

//     }
//     if (file) {

//         console.log(videoId)
//         var readStream = gfb.openDownloadStream(videoId);
//         res.set('Content-Type', file[0].contentType)
//         res.set('Content-Disposition', 'attachment; filename="' + file[0].filename + '"');
//         readStream.pipe(res)

//     }
// });