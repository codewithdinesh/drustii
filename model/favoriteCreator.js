const mongoose = require("mongoose");

const FavoriteCreatorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "user Id required"]
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'creator',
        required: [true, "creator Id required"]
    }

});

const FavoriteCreator = mongoose.model('favoriteCreator', FavoriteCreatorSchema);
module.exports = FavoriteCreator;
