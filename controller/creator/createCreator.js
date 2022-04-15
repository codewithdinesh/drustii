const mongoose = require('mongoose');

const Fileupload = require("../FileUpload");

const conCreate = require("../../config/db").conCreate;

const connConnect = require("../../config/db").conConnect;

const creatorModel = require('../../model/creator');

const TimeStamp = require('../TimeStamp');

const userModel = require('../../model/User');

const config = require("../../config/config");

/* Create User */
const createCreator = async (req, res) => {

    var cover;
    if (req.file) {

        cover = req.file.id;

    }

    var description = req.body.description;

    if (req.user) {

        var user_id = req.user;

        try {

            if (!(description)) {

                return res.status(400).send(JSON.stringify({ "message": "Discription are required", "ResponseCreated": TimeStamp() }));
            }

            const exists = await userModel.exists({ _id: user_id });
            const creatorExists = await creatorModel.exists({ userID: user_id })

            if (!exists) {

                return res.status(403).send({ "message": "user not found" });

            } else {

                // if creator not already exists
                if (!creatorExists) {

                    const newCreator = new creatorModel({
                        userID: user_id,
                        description: description,
                    });

                    if (cover) {
                        newCreator.cover = cover;
                    }

                    newCreator.save();

                    //update creator details or insert details in user model
                    userModel.findOneAndUpdate({ _id: user_id }, {
                        creator: newCreator._id
                    }, { new: true }
                    ).exec();

                    return res.status(200).send({ "message": "creator Enabled" })

                } else {

                    return res.status(403).send({ "message": "you have a already creator account" });

                }


            }

        }
        catch {
            res.status(404).send({ "status": "Something Error in Server", "ResponseCreated": TimeStamp() });
        }
    }


}


module.exports = createCreator;
