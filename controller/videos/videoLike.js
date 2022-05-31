const TimeStamp = require('../TimeStamp');
const videoLikes = require('../../model/likes');
const Video = require('../../model/video');
const User = require('../../model/User');


const LikeVideo = async (req, res) => {

    if (req.user) {

        var videoID = req.query.id
        var userID = req.user;

        videoID = videoID.trim();

        Video.findOne({
            _id: videoID

        }, (err, files) => {

            if (err) {
                return res.status(500).json({ "message": "something error while finding video", "status": 404, "ResponseCreated": TimeStamp() });
            }

            if (!files) {
                return res.status(404).json({ "message": "video not found", "status": 404, "ResponseCreated": TimeStamp() });
            }

            // condition to check check current user is already liked or not
            const updateCondition = {
                _id: videoID,
                "users._id": { $ne: userID }
            }

            // update user when he likes
            const updateLikes = {
                $addToSet: {
                    users: {
                        _id: userID
                    }
                },
                $inc: {
                    likes: 1
                }
            }


            videoLikes.findOneAndUpdate(updateCondition, updateLikes, (err, result) => {
                if (err) {
                    return res.status(501).send({ "message": "Internal error while updating video likes" })
                }
                if (result) {

                    // add liked video in user favorite videos

                    const updateUserLikes = {
                        $addToSet: {
                            favoriteVideos: {
                                _id: videoID
                            }
                        }

                    }

                    User.findOneAndUpdate({ _id: userID }, updateUserLikes, (err_user, res_user) => {
                        if (err_user) {
                            return res.status(501).send({ "message": "Internal error while updating video likes in user" });

                        }
                        if (!res_user) {
                            return res.status(401).send({ "message": "Something went wrong when updating likes" });

                        }
                    })


                    return res.status(200).send({ "message": "video liked", "status": 200 });
                }

                if (!result) {

                    // dislike video

                    const dislikeCondition = {
                        _id: videoID,
                        "users._id": userID
                    }

                    // dislike update
                    const updateLikes = {
                        $pull: {
                            users: {
                                _id: userID
                            }
                        },
                        $inc: {
                            likes: -1
                        }
                    }

                    videoLikes.findOneAndUpdate(dislikeCondition, updateLikes, (dislike_err, dislike_res) => {

                        if (dislike_err) {
                            return res.status(501).send({ "message": "Internal error while updating video likes" })

                        }

                        if (dislike_res) {
                            // update from user favorite videos

                            const updateUserLikes = {
                                $pull: {
                                    favoriteVideos: {
                                        _id: videoID
                                    }
                                }

                            }

                            User.findOneAndUpdate({ _id: userID }, updateUserLikes, (err_user, res_user) => {
                                if (err_user) {
                                    return res.status(501).send({ "message": "Internal error while updating video likes in user" });

                                }
                                if (!res_user) {
                                    return res.status(401).send({ "message": "Something went wrong when updating likes" });

                                }
                            })

                            return res.status(201).send({ "message": "Disliked video", "status": 201 });

                        }
                    })
                }
            });

        });
    }
}
module.exports = LikeVideo;


