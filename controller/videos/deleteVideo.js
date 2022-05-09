const VideoSchema = require("../../model/video");
const TimeStamp = require("../TimeStamp");
const Creator = require("../../model/creator");
var AWS = require('aws-sdk');

var s3 = new AWS.S3();


AWS.config.setPromisesDependency();
AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION
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
            return res.status(5001).json({
              message: "something error while feching video",
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


            // deleting video from s3
            const param = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: files.videoid
            }

            s3.deleteObject(param, (err, data) => {
              if (err) {
                return res.staus(501).send({ "message": "Something Error while deleting video" });
              }
              console.log("video deleted");
            })

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
