const mongoose = require("mongoose");


const VideoLikes = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
        required: true

    },

    users: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            }
        }

    ],

    likes: {
        type: Number,
        required: true,
        default: 0
    }

});

module.exports = mongoose.model("videoLikes", VideoLikes);