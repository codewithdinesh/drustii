const express = require("express");
const app = express.Router();
const controller = require("../controller/controller");
const emailVerification = require("../controller/sendConfirmOTP");
const multer = require('multer');

/* User operations create, login, delete*/
const createUser = require("../controller/user/createUser");
const userLogin = require("../controller/user/userLogin");
const deleteUser = require("../controller/user/deleteUser");
const userProfile = require('../controller/user/userProfile');

/* Creator Login and creation */
const createCreator = require("../controller/creator/createCreator");
const creatorDashboard = require("../controller/creator/creatorDashboard");


/* Authentication Middelware */
const auth = require("../middleware/auth");

/* Videos oprations */
const uploadVideo = require("../controller/videos/uploadVideo");
const hostVideo = require("../controller/videos/videoHost")
const getVideos = require("../controller/videos/getVideos");
const getVideo = require("../controller/videos/getVideo");
const deleteVideo = require("../controller/videos/deleteVideo");
const sendOTP = require("../controller/sendOTP");
const verifyOTP = require("../controller/verifyOTP");
const auth_video = require("../middleware/auth_video");
const videoLike = require("../controller/videos/videoLike");

// check username
const checkUsername = require('../controller/user/checkUsername');
const videoSourceFile = require("../controller/videos/videoSourceFile");



app.get("/", controller.homePage);


/* Create User */
app.post("/create/user", multer({ dest: "/temp" }).single('userAvatar'), createUser);

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

app.post("/create/creator", auth, multer({ dest: "/temp" }).single('coverImg'), createCreator);


/* Login User */
app.get("/login/user", controller.loginPage);
app.post("/login/user", userLogin);


/* Public  user profile */
app.get("/u/:id", userProfile);
app.get("/c/:id", creatorDashboard);

/* Upload video */
app.get("/upload", (req, res) => {
    res.render("uploadVideo");
});

// single("videoSource")

app.post("/upload", auth, multer({ dest: 'temp/' }).fields([{ name: "videoSource", maxCount: 1 }, { name: "videoCover", maxCount: 1 }]), uploadVideo);


/* Get All Videos */
app.get("/videos", getVideos);


/* Get Specific Video */
app.get("/video?:id?:vc", auth_video, getVideo);

app.get("/video/like?:id", auth, videoLike);


/* Delete Video */
app.post("/video/delete?:id", auth, deleteVideo);




/* Modify Video */
// app.post('/video/modify?:id');


app.all("*", (Req, res, next) => {
    return res.status(404).send({ "message": "page not found" })
})






module.exports = app;
