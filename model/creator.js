const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({

	description: {
		type: String,
		required: [true, "creator description required"],
		/* Description of creator Dashboard */
	},

	cover: {
		type: String,
		default:
			"https://pixabay.com/get/g160c785874b40edc13335d981e6f211cffdcaf757c0dced7c74c753c968bc4dc787e71081456672e199b86096ed3d9696d570773c91570703024bcd11e339968_1280.jpg",
	},

	videos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "video",
		},
	],

	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
	]
});

const Creator = mongoose.model("creator", CreatorSchema);
module.exports = Creator;
