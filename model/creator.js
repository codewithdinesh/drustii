const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: [true, "user name required"]
		/* Title of Creator Dashboard */
	},

	email: {
		type: String,
		unique: true,
		required: [true, "Email required"]
	},

	password: {
		type: String,
		required: [true, "creator password required"]
	},

	description: {
		type: String,
		required: [true, "creator description required"]
		/* Description of creator Dashboard */

	},

	avatar: {
		type: String,
		default: "https://pixabay.com/get/gb6f2bf53bddbdbe64a0cd6f29560f7653b199a0f1f5567667b4dd8ae7a1b1456cfa678cf981adc371750e07e668f17e322639b8f6c12f1b142368b2f80d65051_1280.jpg"
	},

	cover: {
		type: String,
		default: "https://pixabay.com/get/g160c785874b40edc13335d981e6f211cffdcaf757c0dced7c74c753c968bc4dc787e71081456672e199b86096ed3d9696d570773c91570703024bcd11e339968_1280.jpg"
	},

	videos: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'video'

	}]

});

const Creator = mongoose.model('Creator', CreatorSchema);
module.exports = Creator;
