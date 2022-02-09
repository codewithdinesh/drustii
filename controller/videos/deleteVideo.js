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
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conCreate.db, {
    bucketName: config.model,
  });
});

const deleteVideo = (req, res) => {
  // let creator_id = req.creator.creator_id;
  if (!req) {
    res.json({ message: "video id not mentioned" });
  } else {
    VideoSchema.findOneAndDelete(
      {
        _id: req.query.id,
      },
      (err, files) => {
        if (err) {
          return res
            .status(500)
            .json({
              status: "something error while feching video",
              code: 500,
              ResponseCreated: TimeStamp(),
            });
        }

        if (!files) {
          return res
            .status(404)
            .json({
              status: "file not found",
              code: 404,
              ResponseCreated: TimeStamp(),
            });
        }
        if (files) {
          Creator.updateOne(
            { _id: files.creator },
            { $pull: { videos: req.query.id } }
          )
            .exec()
            .catch(console.log("Ok deleted"));
          gfs.remove({ _id: files.videoid }, function (err) {
            if (err) return handleError(err);
            console.log("success");
          });

          return res
            .status(200)
            .send({
              message: "video successfully deleted",
              code: 200,
              ResponseCreated: TimeStamp(),
            });
        }
      }
    );
  }
};

module.exports = deleteVideo;
