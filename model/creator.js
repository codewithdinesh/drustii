const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "user name required"]
		/* Title of Creator Dashboard */
	},

	password: {
		type: String,
		required: [true, "creator password required"]
	},

	email: {
		type: String,
		unique: true,
		required: [true, "Email required"]
	},

	description: {
		type: String,
		required: [true, "creator description required"]
		/* Description of creator Dashboard */

	},

	avatar: {
		type: String,
		default: "url"
	},

	cover: {
		type: String,
		default: "url"
	}
	
	/* videos: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'video'

	} */

});

const Creator = mongoose.model('Creator', CreatorSchema);
module.exports = Creator;
