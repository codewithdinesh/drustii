const jwt = require("jsonwebtoken");
const decode = require("jsonwebtoken/decode");
const TimeStamp = require("../controller/TimeStamp");
const creatorSchema = require("../model/creator");
const userSchema = require("../model/User");

const verifyToken = (req, res, next) => {
  const token = req.headers.token || req.cookies.token_id ;

  if (!token) {
    return res.status(401).send({
      message: "Authentication is required",
      code: "401",
      ResponseCreated: TimeStamp(),
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.user_id) {
      //req.user = decoded
      userSchema.findOne({ token: token }, (err, result) => {

        if (err)
          return res.status(400).send({
            message: "Authentication Error",
            code: "400",
            ResponseCreated: TimeStamp(),
          });


        if (!result) {
          return res.status(400).send({
            message: "Invalid Authentication",
            code: "400",
            ResponseCreated: TimeStamp(),
          });

        } else {

          req.user = decoded.user_id;
          req.user_email = result.email;


          if (result.creator) {
            creatorSchema.findOne({ _id: result.creator }, (creatorErr, creatorResult) => {

              if (creatorErr)
                return res.status(404).send({ "message": "Creator Error" });
              if (creatorResult) {

                req.creator = creatorResult._id;

                return next()
              }
            })
          } else {
            return next();
          }

        }

      });
    }
    /*  res.status(200).json({ "status": "Verification Success", "code": "200", "ResponseCreated": timestamp, "user": req.user }) */
  } catch (err) {
    return res.status(400).send({ message: "Invalid Token" });
  }

};

module.exports = verifyToken;
