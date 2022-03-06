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
		type: String,
		default:
			"https://pixabay.com/get/gb6f2bf53bddbdbe64a0cd6f29560f7653b199a0f1f5567667b4dd8ae7a1b1456cfa678cf981adc371750e07e668f17e322639b8f6c12f1b142368b2f80d65051_1280.jpg",
	},
	favoriteVideos: {
		/* list of favorite videos */
	},
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
