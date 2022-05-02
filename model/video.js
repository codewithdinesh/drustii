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

    privacy: {
        

    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "creator",
        required: [true, "creator Id required"]
    }
});

const Video = mongoose.model('video', VideoSchema);
module.exports = Video;
