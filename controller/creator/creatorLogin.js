
const creatorModel = require('../../model/creator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validateEmail = require('../emailValidate');
const TimeStamp = require('../TimeStamp');

const creatorlogin = (req, result, next) => {

    let email = req.body.email;
    let password = req.body.password;

    if (!(email && password)) {
        result.status(400).send(JSON.stringify({ "message": "error: All the inputs are required", "ResponseCreated": TimeStamp() }));

    } else {
        if (validateEmail(email) == true) {
            creatorModel.findOne({ email: email }, function (err, creator) {
                if (err) return err;
                if (!creator) return result.status(401).send({ "status": "user not found", "email": email, "ResponseCreated": TimeStamp() });

                bcrypt.compare(password, creator.password, function (err, res) {
                    if (err) return err;
                    if (res === false) {
                        return result.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": TimeStamp() })
                    }

                    // Create token
                    const token = jwt.sign(
                        {
                            creator_id: creator._id
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
                        }
                    );

                    // save user token
                    creatorModel.findOneAndUpdate({ _id: creator._id }, {
                        token: token
                    },
                        { new: true }
                    ).exec();
                    /*  creator.token = token; */
                    let options = {
                        path: "/",
                        sameSite: true,
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                        httpOnly: true
                    }

                    result.cookie('token_id', token, options);
                    result.status(200).send({ "status": "login success", "login_token": token, "email": email, "ResponseCreated": TimeStamp() });
                    /* 
                    result.redirect('/');
                    */

                });

            });
        } else {
            return result.status(401).send({ "status": "Invalid Email", "email": email, "ResponseCreated": TimeStamp() })
        }


    }


}
module.exports = creatorlogin;