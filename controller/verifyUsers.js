const creatorSchema = require('../model/creator');
const userSchema = require('../model/User');
const TimeStamp = require('../controller/TimeStamp');

const verifyUser = (token, id) => {
    var obj;

    /* Verify creator Account */
    if (id.creator_id) {
        creatorSchema.findOne({ token: token }, (err, result) => {
            if (err) {
                obj = { "status": "Authentication Error", "code": "403", "ResponseCreated": TimeStamp() };

            }
            if (!result) {
                obj = { "status": "Invalid Authentication", "code": "403", "ResponseCreated": TimeStamp() };

            }
            console.log("Creator Found success");
            req.creator = decoded;

        });
    }

    /* Verify User account */
    if (id.user_id) {
        userSchema.findOne({ token: token }, (err, result) => {
            if (err) { return { "status": "Authentication Error", "code": "403", "ResponseCreated": TimeStamp() } };
            if (!result) {
                return { "status": "Invalid Authentication", "code": "403", "ResponseCreated": TimeStamp() };
            }
            if (decoded.user_id) {
                req.user = decoded;
            }
        });
    }
    return obj;
}


module.exports = verifyUser;