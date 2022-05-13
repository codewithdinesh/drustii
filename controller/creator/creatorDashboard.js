const Creator = require("../../model/creator");
const User = require("../../model/User");

const creatorDashboard = (req, res) => {

    const username = req.params.id;
    let avatarKey;
    let coverKey;

    if (!username) {
        return res.status(401).send({ "message": "Please specify Creator ID" })

    }

    User.findOne({ username }, (err_user, res_user) => {

        if (err_user) {
            return res.status(501).send({ "message": "Something went wrong" })
        }
        if (!res_user) {
            return res.status(401).send({ "message": "User Not Found" })
        }

        if (!res_user.creator) {
            return res.status(200).send({ "username": username, "avatar": res_user.avatar });
        }

        else {
            const creatorID = res_user.creator;
            let creatorName = res_user.name;


            // avatar
            if (res_user.avatar) {
                avatarKey = res_user.avatar
            } else {
                avatarKey = "avatar/profile_img.png"
            }


            Creator.findOne({ _id: creatorID }, (err_creator, res_creator) => {

                if (err_creator) {
                    return res.status(501).send({ "message": "Something went wrong" })
                }
                if (!res_creator) {
                    return res.status(401).send({ "message": "Creator Not Found" })
                }

                let description = res_creator.description;

                //generate url for cover and avatar
                let videos = res_creator.videos;
                let followers = res_creator.followers;
                let followers_count = followers.length;

                const avatar = s3.getSignedUrl("getObject", {
                    Key: avatarKey,
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Expires: 12000
                });


                if (res_creator.cover) {
                    coverKey = res_creator.cover;
                }

                const cover = s3.getSignedUrl("getObject", {
                    Key: coverKey,
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Expires: 12000
                });

                return res.status(200).send({ "username": username, "avatar": avatar, creatorName, description, cover, videos, followers_count });
            })
        }
    })


}
module.exports = creatorDashboard;