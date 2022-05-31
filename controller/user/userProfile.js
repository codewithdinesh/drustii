const CreatorModel = require("../../model/creator");
const UserModel = require("../../model/User")

const userProfile = (req, res) => {

    let userID = req.user;
    // let userName = req.user;

    if (!userID) {

        return res.status(404).send({ "message": "Please Login to access profile" });

    } else {

        UserModel.findOne({ _id: userID }, (err, user) => {
            if (err) {
                return res.status(401).send({ "message": "Something Error in server" });
            }

            if (user) {

                const creatorID = user.creator;
                const username = user.username;
                let avatarKey;
                const email = user.email;
                const gender = user.gender;
                const favoriteVideos = user.favoriteVideos;
                const name = user.name;

                // avatar
                if (user.avatar) {
                    avatarKey = user.avatar
                } else {
                    avatarKey = "avatar/profile_img.png"
                }

                const avatar = s3.getSignedUrl("getObject", {
                    Key: avatarKey,
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Expires: 12000
                });


                return res.status(200).send({ name,username, email, avatar, creatorID, gender, favoriteVideos })

            }
        });
    }
}
module.exports = userProfile;