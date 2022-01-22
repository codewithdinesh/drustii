const mongoose = require("mongoose");

const UserOTP = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        expires: '5m',
        default: Date.now
    }
});

module.exports = mongoose.model("userOTP", UserOTP);