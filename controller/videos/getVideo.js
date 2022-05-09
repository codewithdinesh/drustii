
const likes = require('../../model/likes');
const VideoSchema = require('../../model/video');
const Views = require('../../model/Views');
const TimeStamp = require('../TimeStamp');

const getVideo = (req, res) => {

    let videoCoverUrl = " ";
    let VideoViews, videoUploadedOn, videoLikes;

    var videoID = req.query.id
    videoID = videoID.trim();

    VideoSchema.findOne({

        _id: videoID

    }, async (err, files) => {
        try {


            if (err) {
                return res.status(500).json({ "message": "something error while finding video", "code": 404, "ResponseCreated": TimeStamp() });
            }


            if (!files) {
                return res.status(404).json({ "message": "video not found", "code": 404, "ResponseCreated": TimeStamp() });
            }

            await Views.findOneAndUpdate({ _id: videoID }, {
                $inc: { Views: 1 }
            }).exec();

            //videoUploaded on
            videoUploadedOn = files.uploadOn;

            // finding views 
            await Views.findOne({ _id: videoID }, (err_Views, result_Views) => {

                if (err_Views) {
                    return res.status(500).send({ "message": "Eroor" })
                }
                if (!result_Views) {
                    return res.status(409).send({ "message": "Views NOt Found" })
                }
                res.videoViews = result_Views.Views;


            }).clone().catch(function (err) { console.log(err) });;


            //finding Likes
            await likes.findOne({ _id: videoID }, (err_likes, res_likes) => {
                if (err_likes) {

                    return res.staus(404).send({ "message": "Error while finding Likes of video" });

                }

                if (!res_likes) {
                    return res.status(401).send({ "message": "Video Likes are not found" });

                }

                videoLikes = res_likes.likes;

                //videoViews
                VideoViews = res.videoViews;

                const videoPrivacy = files.privacy;

                if (videoPrivacy.privacy == "shareonly") {
                    if (req.user) {
                        let i;
                        if (videoPrivacy.user) {
                            for (i = 0; i < videoPrivacy.user.length; i++) {
                                if (videoPrivacy.user[i] == req.user_email) {
                                    const videoKey = files.videoid;
                                    // video Source link
                                    const signedUrl = s3.getSignedUrl("getObject", {
                                        Key: videoKey,
                                        Bucket: process.env.AWS_BUCKET_NAME,
                                        Expires: 12000
                                    });
                                    if (files.videoCover) {
                                        videoCoverUrl = s3.getSignedUrl("getObject", {
                                            Key: files.videoCover,
                                            Bucket: process.env.AWS_BUCKET_NAME,
                                            Expires: 12000
                                        });
                                    }
                                    res.send({ "videoID": files._id, "videoTitle": files.title, "videoDescription": files.description, "videoCreator": files.creator, "videoSource": signedUrl, "videoCover": videoCoverUrl, "videoViews": VideoViews, videoLikes, videoUploadedOn });
                                    break;
                                }
                            }
                        } else {
                            return res.status(404).send({ "message": "You have not permission to access the video" })
                        }
                    } else {
                        return res.status(404).send({ "message": "Please Login to access the video" })
                    }
                } else {
                    const videoKey = files.videoid;
                    // video Source link
                    const signedUrl = s3.getSignedUrl("getObject", {
                        Key: videoKey,
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Expires: 12000
                    });

                    if (files.videoCover) {
                        videoCoverUrl = s3.getSignedUrl("getObject", {
                            Key: files.videoCover,
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Expires: 12000
                        });

                    }


                    res.send({ "videoID": files._id, "videoTitle": files.title, "videoDescription": files.description, "videoCreator": files.creator, "videoSource": signedUrl, "videoCover": videoCoverUrl, "videoViews": VideoViews, videoLikes, videoUploadedOn });
                }
            }).clone().catch(function (err) { console.log(err) });

        } catch (e) {
            console.log(e)
        }


    }).clone().catch(function (err) { console.log(err) });
}
module.exports = getVideo;


