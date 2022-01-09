const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "user Id required"]
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'video',
        required: [true, "video Id required"]
    }

});

const watchHistory = mongoose.model('watchHistory', watchHistorySchema);
module.exports = watchHistory;
