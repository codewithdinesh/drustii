const Video = require("../../model/video");

const searchVideo = (req, res) => {

    var videos = {};
    var videoList = [];

    let searchTerm = req.query.search;

    searchTerm = searchTerm.replace(/^\s+|\s+$/gm, '');

    if (!searchTerm) {
        return res.status(404).send({ "message": "please specify search" })
    } else {


        const searchQuery = {
            $text: {
                $search: searchTerm
            }
        }

        const projection = {
            _id: 1,
            title: 1,
            description:1
          };

        Video.find(searchQuery, async (err, files) => {

            if (err) {
                
                console.log(err)
                return res.status(501).send({ "message": "Something error occured " })
            }

            if (!files || files.length === 0) {
                return res.status(404).json({
                    "message": "videos not found"
                });
            }

            for (var i = 0; i < files.length; i++) {

                let videoId = files[i]._id

                videos = {
                    videoId,
                }

                videoList.push(videos);

            }
            res.status(200).send(videoList);
        }).projection(projection);
    }

}

module.exports = searchVideo;