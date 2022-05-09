const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({

    videoid: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: [true, "video Title required"]
    },

    description: {
        type: String,
        required: [true, "description required"]
    },

    videoCategory: {
        type: String
    },

    videoCover: {
        type: String
    },

    privacy: {

    },
    videoCategory: {
        type: String,
        default: "entertainment"
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "creator",
        required: [true, "creator Id required"]
    },
    uploadOn: {
        type: String,
        default: new Date().toLocaleString()
    }
});

const Video = mongoose.model('video', VideoSchema);
module.exports = Video;
