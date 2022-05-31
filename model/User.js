const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

	username: {
		type: String,
		unique: true,
		required: [true, "user name required"],
		index: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: [true, "password required"],
	},
	email: {
		type: String,
		unique: true,
		index: true,
		required: [true, "Email required"],
	},
	name: {
		type: String,
		required: [true, "name required"],
	},
	dob: {
		type: String,
		required: [true, "DOB required"],
	},
	gender: {
		type: String,
		required: [true, "Gender required"],
		default: "Other"
	},
	token: {
		type: String,
	},
	avatar: {
		type: String
	},
	favoriteVideos: [{

		/* list of favorite videos */
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "video"
		}
	}
	],

	favoriteCreators: {
		/* List of favorite creators  */
		/* Following users list */
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "creator",
	},
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
