const VideoSchema = require("../../model/video");
const TimeStamp = require("../TimeStamp");
const Creator = require("../../model/creator");
var AWS = require('aws-sdk');
const Views = require("../../model/Views");
const likes = require("../../model/likes");
const User = require("../../model/User");

var s3 = new AWS.S3();


AWS.config.setPromisesDependency();
AWS.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.AWS_REGION
});


const deleteVideo = (req, res) => {

  const videoID = req.query.id;

  if (req.creator) {

    if (!req) {

      return res.status(404).json({ message: "video not found" });

    } else {

      //Deleting from videos schema
      VideoSchema.findOneAndDelete(
        {
          _id: videoID, creator: req.user
        }, (err, files) => {

          if (err) {
            return res.status(501).json({
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
                  videos: videoID
                }
              }).exec();

            // delete views model
            Views.findOneAndDelete({ _id: videoID }, (err_views, res_view) => {
              if (err_views) {
                return res.status(501).json({
                  message: "something error while feching video",
                  code: 500,
                  ResponseCreated: TimeStamp(),
                });
              }

              if (!res_view) {
                return res.status(404).json({
                  status: "Video Not Found",
                  code: 404,
                  ResponseCreated: TimeStamp(),
                });
              }

            });

            //users liked video


            //delete like model
            likes.findOneAndDelete({ _id: videoID }, (err_views, res_view) => {
              if (err_views) {
                return res.status(501).json({
                  message: "something error while feching video",
                  code: 500,
                  ResponseCreated: TimeStamp(),
                });
              }

              if (!res_view) {
                return res.status(404).json({
                  status: "Video Not Found",
                  code: 404,
                  ResponseCreated: TimeStamp(),
                });
              }


              let LikedUsers = res_view.users;
              let i = 0;

              // delete video from liked users section
              for (i; i < LikedUsers.length; i++) {

                const updateUserLikes = {
                  $pull: {
                    favoriteVideos: {
                      _id: videoID
                    }
                  }
                }

                User.findOneAndUpdate({ _id: LikedUsers[i] }, updateUserLikes, (err_user, res_user) => {
                  if (err_user) {
                    return res.status(501).send({ "message": "Internal error while updating video likes in user" });

                  }
                  if (!res_user) {
                    return res.status(401).send({ "message": "Something went wrong when updating likes" });

                  }
                });
              }

            });


            // deleting video from s3
            const param = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: files.videoid
            }



            s3.deleteObject(param, (err, data) => {
              if (err) {
                return res.staus(501).send({ "message": "Something Error while deleting video" });
              }

            });

            if (files.videoCover != "") {
              //deleting video Cover from s3
              const paramVideoCover = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: files.videoCover
              }

              s3.deleteObject(paramVideoCover, (err, data) => {
                if (err) {
                  return res.status(501).send({ "message": "Something Error while deleting video Cover" });
                }

              });
            }


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
