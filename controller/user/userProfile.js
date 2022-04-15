const CreatorModel = require("../../model/creator");
const UserModel = require("../../model/User")

const findProfile = (req, res) => {

    // userID = req.params.id
    let userName = req.params.id;

    if (!userName) {

        return res.status(404).send({ "message": "Please Specify username" });

    } else {
        UserModel.findOne({ username: userName }, (err, user) => {
            if (err) {
                return res.status(401).send({ "message": "Something Error in server" });
            }

            if (user) {

                const creatorID = user.creator;

                CreatorModel.findById({ _id: creatorID }, (creatorErr, creator) => {

                    return res.status(200).send({ "username": user.username, "cover": creator.cover, "avatar": user.avatar, "description": creator.description, "videos": creator.videos, "followers": creator.followers })

                });

            }
        });
    }
}
module.exports = findProfile