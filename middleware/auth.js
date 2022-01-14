const jwt = require("jsonwebtoken");
const TimeStamp = require('../controller/TimeStamp');
const creatorSchema = require('../model/creator');
const userSchema = require('../model/User');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token_id || req.body.token_id;
    if (!token) {

        return res.status(403).send({ "status": "Authentication is required", "code": "403", "ResponseCreated": TimeStamp() });

    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        creatorSchema.findOne({ token: token }, (err, result) => {
            if (err) return res.status(403).send({ "status": "Invalid Authentication", "code": "403", "ResponseCreated": TimeStamp() });
            if (decoded.creator_id) {
                req.creator = decoded;
            }
        }).exec();

        userSchema.findOne({ token: token }, (err, result)=>{
            
        })

        if (decoded.user_id) {
            req.user = decoded;
        }
        if (decoded.creator_id) {
            req.creator = decoded;
        }

        console.log(decoded)
        /*  res.status(200).json({ "status": "Verification Success", "code": "200", "ResponseCreated": timestamp, "user": req.user }) */

    } catch (err) {
        return res.status(401).send({ "message": "Invalid Token" });
    }
    return next();
};

module.exports = verifyToken;