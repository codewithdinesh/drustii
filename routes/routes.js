const express = require("express");
const app = express.Router();
const Fileupload = require("../controller/FileUpload");
const upload = Fileupload.upload;
const controller = require("../controller/controller");
const emailVerification = require("../controller/sendConfirmOTP");

/* User operations create, login, delete*/
const createUser = require("../controller/user/createUser");
const userLogin = require("../controller/user/userLogin");
const deleteUser = require("../controller/user/deleteUser");
const userProfile = require('../controller/user/userProfile');

/* Creator Login and creation */
const createCreator = require("../controller/creator/createCreator");


/* Authentication Middelware */
const auth = require("../middleware/auth");

/* Videos oprations */
const uploadVideo = require("../controller/videos/uploadVideo");
const hostVideo=require("../controller/videos/videoHost")
const getVideos = require("../controller/videos/getVideos");
const getVideo = require("../controller/videos/getVideo");
const deleteVideo = require("../controller/videos/deleteVideo");
const sendOTP = require("../controller/sendOTP");
const verifyOTP = require("../controller/verifyOTP");

// check username
const checkUsername = require('../controller/user/checkUsername');

// store avatar
const storeAvatar = require('../controller/user/storeAvatar').upload;

//store cover images of creator
const storeCover = require("../controller/creator/storeCover").upload;


app.get("/", controller.homePage);


/* Create User */
app.post("/create/user", storeAvatar.single('userAvatar'), createUser);

app.get("/create/user", (req, res) => {
    res.render("userRegister");
});

/* Email Verification */
app.post("/user/verification", sendOTP);
app.get("/user/verification");

app.post("/user/verify", verifyOTP);

// check username
app.post('/check/username', checkUsername);


/* Delete user */
app.delete("/delete/user", deleteUser);


/* Create Creator */
app.get("/create/creator", (req, res) => {
    res.render("creatorRegister");
});

app.post("/create/creator", auth, storeCover.single('coverImg'), createCreator);


/* Login User */
app.get("/login/user", controller.loginPage);
app.post("/login/user", userLogin);


/* Public  user profile */
app.get("/u/:id", userProfile);

/* Upload video */
app.get("/upload", (req, res) => {
    res.render("uploadVideo");
});

app.post("/upload", auth, upload.single("videoSource"), uploadVideo);


/* Get All Videos */
app.get("/videos", getVideos);


/* Get Specific Video */
app.get("/video?:id", getVideo);

/* stream video */
app.get("/v/:id", hostVideo);


/* Delete Video */
app.post("/video/delete?:id", auth, deleteVideo);


/* Modify Video */
// app.post('/video/modify?:id');






module.exports = app;
