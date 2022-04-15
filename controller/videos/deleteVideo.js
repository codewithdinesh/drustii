const mongoose = require("mongoose");
const Fileupload = require("../FileUpload");
const VideoSchema = require("../../model/video");
const TimeStamp = require("../TimeStamp");
const config = require("../../config/config");
const conCreate = require("../../config/db").conCreate;
const connConnect = require("../../config/db").conConnect;
const Creator = require("../../model/creator");

let gfs;

conCreate.once("open", () => {

  gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
    bucketName: config.model,
  });
});

const deleteVideo = (req, res) => {

  if (req.creator) {

    if (!req) {

      return res.status(404).json({ message: "video not found" });

    } else {

      //Deleting from videos schema
      VideoSchema.findOneAndDelete(
        {
          _id: req.query.id, creator: req.user
        }, (err, files) => {

          if (err) {
            return res.status(500).json({
              status: "something error while feching video",
              code: 500,
              ResponseCreated: TimeStamp(),
            });
          }

          if (!files) {
            return res.status(404).json({
              status: "Video Not Found",
              code: 404,
              ResponseCreated: TimeStamp(),
            });
          }


          if (files) {

            // Deleting video from creator videos array
            Creator.updateOne({ _id: req.creator },
              {
                $pull: {
                  videos: req.query.id
                }
              }).exec();

            // Deleting video Files and Chunks
            gfs.delete(new mongoose.Types.ObjectId(files.videoid),
              (err, data) => {
                if (err) {
                  return res.status(404).json({
                    status: "Video Not Found",
                    code: 404,
                    ResponseCreated: TimeStamp(),
                  });
                }
                if (data) {
                  console.log(data)
                }
              });

            return res.status(200).send({
              message: "video successfully deleted",
              code: 200,
              ResponseCreated: TimeStamp(),
            });

          }

        }

      );

    }
  } else {
    res.status(404).send({ "message": "Please Login to Delete videos", ResponseCreated: TimeStamp() })
  }

};

module.exports = deleteVideo;
