const mongoose = require('mongoose');
const config = require('../../config/config');
const likes = require('../../model/likes');
const conCreate = require("../../config/db").conCreate;
const connConnect = require("../../config/db").conConnect;
const VideoSchema = require('../../model/video');
const Views = require('../../model/Views');
const TimeStamp = require('../TimeStamp');
let videoViews = 0, videoLikes = 0;


const getVideos = (req, res) => {

    var videos = {};
    var videoList = [];


    var categories; // pass categories to sort out result 

    VideoSchema.find({ "privacy": { "privacy": "public" } }, async (err, files) => {

        if (err) {
            return res.status(501).send({ "message": "Something eror " })
        }

        if (!files || files.length === 0) {
            return res.status(404).json({
                err: "no files exist"
            });
        }

        for (var i = 0; i < files.length; i++) {

            var videoCoverUrl;

            // videoCover
            if (files[i].videoCover) {
                if (files[i].videoCover != "") {

                    videoCoverUrl = s3.getSignedUrl("getObject", {
                        Key: files[i].videoCover,
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Expires: 12000
                    });
                } else {
                    videoCoverUrl = " "
                }
            }

            // videoSource
            let videoSource = s3.getSignedUrl("getObject", {
                Key: files[i].videoid,
                Bucket: process.env.AWS_BUCKET_NAME,
                Expires: 12000
            });

            //videoId
            let videoId = files[i]._id;

            //creatorID
            let creatorId = files[i].creator;

            // videoTitle
            let videoTitle = files[i].title;

            // videoDescription
            let videoDescription = files[i].description;

            // videoUploaded on
            let videoUploadedOn = files[i].uploadOn;

            //videoViews


            async function videoViewsFunc(vId, callback) {

                Views.findOne({ _id: vId }, (err_views, res_views) => {
                    if (err_views) {
                        callback(err_views, null);
                    }

                    if (!res_views) {
                        callback(res_views, null);
                    }
                    callback(null, res_views)

                });
            }


            async function videoLikesFunc(vId, callback) {

                likes.findOne({ _id: vId }, (err_views, res_views) => {
                    if (err_views) {
                        callback(err_views, null);
                    }

                    if (!res_views) {
                        callback(res_views, null);
                    }
                    callback(null, res_views)

                });
            }

            videoViews = 0;

            await videoViewsFunc(videoId, async function (err_views, res_views) {
                if (err_views) {
                    return res.staus(404).send({ "message": "Error while finding views of video" });
                }
                if (!res_views) {
                    return res.status(401).send({ "message": "Video Views are not found" });
                }


                videoViews = res_views.Views;


                // videoLikes
                await videoLikesFunc(videoId, (err_likes, res_likes) => {
                    if (err_likes) {

                        return res.staus(404).send({ "message": "Error while finding Likes of video" });

                    }

                    if (!res_likes) {
                        return res.status(401).send({ "message": "Video Likes are not found" });

                    }

                    videoLikes = res_likes.likes;
                });

                console.log(videoViews)

            });

            videos = {
                videoId,
                "videoCover": videoCoverUrl,
                videoSource,
                creatorId,
                videoTitle,
                videoDescription,
                videoViews,
                videoLikes,
                videoUploadedOn
            }


            videoList.push(videos);

        }

        res.status(200).send(videoList);
    });
}

module.exports = getVideos;


