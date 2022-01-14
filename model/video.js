const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "video Title required"]
    },
    description: {
        type: String,
        required: [true, "description required"]
    },
    source: {
        type: String,
        required: [true, "source Id required"]
    },
    
    privacy: {
        type: String,
        enum: ["public", "private", "shareOnly"],
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "creator",
        required: [true, "creator Id required"]
    },

    videoCover: {
        type: String,
        required: [true, "video cover required"],
        default: "https://pixabay.com/get/gb5df1bcef598dc4cfe4c37fff1ba994ca8b2837be76d709f83dd1bbc3b12cf18d140717d4ec7dfab2a65ae6626f92c1d8ec09045adc83a21b5708ceb269b28ac_1280.jpg"
    }
});

const Video = mongoose.model('video', VideoSchema);
module.exports = Video;
