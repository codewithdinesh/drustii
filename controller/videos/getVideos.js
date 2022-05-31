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

    // get videos by categories
    var videos = {};
    var videoList = [];

    var categories;
    var creator;
    let findCondition;

    if (req.query.categories) {
        categories = req.query.categories;
        categories=categories.trim()
    }

    if (req.query.c) {
        creator = req.query.c;
    }

    if (!categories) {
        if (!creator) {
            findCondition = { "privacy": { "privacy": "public" } };

        }
        else {
            findCondition = { "privacy": { "privacy": "public" }, "creator": creator };
        }

    } else {
        if (!creator) {
            findCondition = { "privacy": { "privacy": "public" }, "videoCategory": categories };
        }
        else {
            findCondition = { "privacy": { "privacy": "public" }, "videoCategory": categories, "creator": creator };
        }
    }


    VideoSchema.find(findCondition, async (err, files) => {

        if (err) {
            return res.status(501).send({ "message": "Something eror " })
        }

        if (!files || files.length === 0) {
            return res.status(404).json({
                err: "no files exist"
            });
        }

        for (var i = 0; i < files.length; i++) {

            let videoId = files[i]._id

            videos = {
                videoId,
            }

            videoList.push(videos);

        }
        res.status(200).send(videoList);
    });
}

module.exports = getVideos;


