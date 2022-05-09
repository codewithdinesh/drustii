const mongoose = require("mongoose");


const VideoViews = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
        required: true
    },

    Views: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("VideoViews", VideoViews);