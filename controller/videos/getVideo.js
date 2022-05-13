
const likes = require('../../model/likes');
const VideoSchema = require('../../model/video');
const Views = require('../../model/Views');
const TimeStamp = require('../TimeStamp');
const Users = require('../../model/User');

const getVideo = (req, res) => {

    let videoCoverUrl = " ";
    let VideoViews, videoUploadedOn, videoLikes;

    // video ID
    var videoID = req.query.id

    // false to not increase views, if true or not specified then increase video views
    var vc = req.query.vc;


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
            if (vc) {
                if (vc == "true") {
                    await Views.findOneAndUpdate({ _id: videoID }, {
                        $inc: { Views: 1 }
                    }).exec();
                }
            } else {
                await Views.findOneAndUpdate({ _id: videoID }, {
                    $inc: { Views: 1 }
                }).exec();
            }


            //videoUploaded on
            videoUploadedOn = files.uploadOn;

            // finding views 
            await Views.findOne({ _id: videoID }, (err_Views, result_Views) => {

                if (err_Views) {
                    return res.status(500).send({ "message": "Eroor" })
                }
                if (!result_Views) {
                    return res.status(409).send({ "message": "Views Not Found" })
                }
                res.videoViews = result_Views.Views;


            }).clone().catch(function (err) { console.log(err) });;


            //finding Likes
            await likes.findOne({ _id: videoID }, (err_likes, res_likes) => {
                if (err_likes) {

                    return res.staus(501).send({ "message": "Error while finding Likes of video" });

                }

                if (!res_likes) {
                    return res.status(401).send({ "message": "Video Likes are not found" });

                }

                videoLikes = res_likes.likes;

                //videoViews
                VideoViews = res.videoViews;

                const videoCreator = files.creator;

                Users.findOne({ _id: videoCreator }, (err_user, res_user) => {
                    if (err_user) {
                        return res.staus(501).send({ "message": "Error while finding Creator of video" });
                    }

                    if (!res_user) {
                        return res.status(401).send({ "message": "Video Creator are not found" });
                    }

                    const userName = res_user.username;
                    const creatorName = res_user.name;
                    let avatarKey;

                    if (res_user.avatar) {
                        avatarKey = res_user.avatar
                    } else {
                        avatarKey = "avatar/profile_img.png"
                    }



                    const avatar = s3.getSignedUrl("getObject", {
                        Key: avatarKey,
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Expires: 12000
                    });


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

                                        let videoCoverKey;

                                        if (files.videoCover) {
                                            videoCoverKey = files.videoCover;
                                        }

                                        return res.send({ "videoID": files._id, "videoTitle": files.title, "videoDescription": files.description, "videoCreator": videoCreator, creatorName, userName, avatar, "videoSource": signedUrl, "videoCover": videoCoverUrl, "videoViews": VideoViews, videoLikes, videoUploadedOn });

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
                            videoCoverKey = files.videoCover;
                        }

                        videoCoverUrl = s3.getSignedUrl("getObject", {
                            Key: videoCoverKey,
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Expires: 12000
                        });


                        return res.send({ "videoID": files._id, "videoTitle": files.title, "videoDescription": files.description, "videoCreator": videoCreator, creatorName, userName, avatar, "videoSource": signedUrl, "videoCover": videoCoverUrl, "videoViews": VideoViews, videoLikes, videoUploadedOn });
                    }
                });

            }).clone().catch(function (err) { console.log(err) });

        } catch (e) {
            console.log(e)
        }
    }).clone().catch(function (err) { console.log(err) });
}
module.exports = getVideo;


