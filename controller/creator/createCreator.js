const mongoose = require('mongoose');

const Fileupload = require("../FileUpload");

const conCreate = require("../../config/db").conCreate;

const connConnect = require("../../config/db").conConnect;

const creatorModel = require('../../model/creator');

const TimeStamp = require('../TimeStamp');

const userModel = require('../../model/User');

const config = require("../../config/config");


const crypto = require("crypto");

// AWS
const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');
const multer = require('multer');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

aws.config.setPromisesDependency();
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
});



/* Create User */
const createCreator = async (req, res) => {

    var cover;

    var coverKey, coverPath, coverParam, coverFileKey;


    var description = req.body.description;

    if (req.user) {

        var user_id = req.user;

        try {

            if (!(description)) {

                return res.status(400).send(JSON.stringify({ "message": "Discription are required", "ResponseCreated": TimeStamp() }));
            }

            if (req.file) {

                cover = req.file;

                coverKey = crypto.randomUUID()

                coverPath = cover.path;

                const coverMimeType = cover.mimetype;

                if (coverMimeType.startsWith("image")) {

                    coverFileKey = "coverImages/" + coverKey + path.extname(cover.originalname);

                    coverParam = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Body: fs.createReadStream(coverPath),
                        Key: coverFileKey,
                        ACL: 'public-read',
                        ContentType: "image/png"
                    }

                }
                else {

                    return res.status(401).send({ "message": "Cover File should be Image File" });

                }

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
                        newCreator.cover = coverFileKey;

                        s3.upload(coverParam, (err, response) => {
                            if (err) {
                                console.log("Error while uploading Cover Image")
                            }
                            console.log("Cover image Uploaded successfully")

                        });

                        fs.unlink(coverPath, (err) => {
                            if (err) {
                                console.log("error")
                            }
                            console.log("Temp file deleted")
                        })
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
