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
    index: {
        expires: 3000
    }
});