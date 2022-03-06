
const mongoose = require('mongoose');

const conCreate = require("../../config/db").conCreate;

const connConnect = require("../../config/db").conConnect;

const userModel = require('../../model/User');

const userNameValidate = require("../userNameValidate");


const userNameExists = async (req, res) => {

    let username = req.body.username;

    if (userNameValidate(username) == false) {
        return res.status(409).send({ "message": "invalid username format", "status": 409 });
    }

    const userNameExist = await userModel.exists({ username: username });

    if (userNameExist == false) {

        return res.status(200).send({ "message": "username is available", "status": 200 });

    } else {

        return res.status(201).send({ "message": "username is not available", "status": 201 });
    }
}

module.exports = userNameExists