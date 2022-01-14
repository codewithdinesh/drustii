
const creatorModel = require('../../model/creator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const validateEmail = require('../emailValidate');
const TimeStamp = require('../TimeStamp');

const creatorlogin = (req, result) => {

    let email = req.body.email;
    let password = req.body.password;

    if (!(email && password)) {
        result.status(400).send(JSON.stringify({ "message": "error: All the inputs are required", "ResponseCreated": TimeStamp() }));

    } else {
        if (validateEmail(email) == true) {
            creatorModel.findOneAndDelete({ email: email }, function (err, creator) {
                if (err) return err;
                if (!creator) return result.status(401).send({ "status": "user not found", "email": email, "ResponseCreated": TimeStamp() });

                bcrypt.compare(password, creator.password, function (err, res) {
                    if (err) return err;
                    if (res === false) {
                        return result.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": TimeStamp() })
                    }

                    result.status(200).send({ "status": "Creator Deleted", "email": email, "ResponseCreated": TimeStamp() });
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