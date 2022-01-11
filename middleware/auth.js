const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token_id;
    const currentDate = new Date().getTime();
    const timestamp = new Date(currentDate);

    if (!token) {
        console.log("token  " + token)

        return res.status(403).send({ "status": "Authentication is required", "code": "403", "ResponseCreated": timestamp });

    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        /*  res.status(200).json({ "status": "Verification Success", "code": "200", "ResponseCreated": timestamp, "user": req.user }) */

    } catch (err) {
        return res.status(401).send({ "message": "Invalid Token" });
    }
    return next();
};

module.exports = verifyToken;