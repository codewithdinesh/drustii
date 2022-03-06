const jwt = require("jsonwebtoken");
const decode = require("jsonwebtoken/decode");
const TimeStamp = require("../controller/TimeStamp");
const creatorSchema = require("../model/creator");
const userSchema = require("../model/User");

const verifyToken = (req, res, next) => {
  const token = req.header.token || req.body.token || req.cookies.token_id;

  if (!token) {
    return res.status(403).send({
      status: "Authentication is required",
      code: "403",
      ResponseCreated: TimeStamp(),
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.user_id) {
      //req.user = decoded
      userSchema.findOne({ token: token }, (err, result) => {

        if (err)
          return res.status(403).send({
            status: "Authentication Error",
            code: "403",
            ResponseCreated: TimeStamp(),
          });


        if (!result) {
          return res.status(403).send({
            status: "Invalid Authentication",
            code: "403",
            ResponseCreated: TimeStamp(),
          });
        } else {
          req.user = decoded;
          return next();

        }

      });
    }
    /*  res.status(200).json({ "status": "Verification Success", "code": "200", "ResponseCreated": timestamp, "user": req.user }) */
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }

};

module.exports = verifyToken;
