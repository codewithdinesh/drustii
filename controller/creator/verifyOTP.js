const verify = require("../emailVerification")

const verifyOTP = (req, res, next) => {

    res.send(``)
    const userOTP = req.body.OTP;
    if (userOTP == req.OTP) {
        console.log("OTP matched");
        res.status(200).json({ "status": "OTP verified" })
    }
    else {
        console.log("OTP does not match");
        res.json({
            "status": "OTP does not match"
        })
    }
    return next();
}

module.exports = verifyOTP;