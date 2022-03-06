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
const getVideos = require("../controller/videos/getVideos");
const getVideo = require("../controller/videos/getVideo");
const deleteVideo = require("../controller/videos/deleteVideo");
const sendOTP = require("../controller/sendOTP");
const verifyOTP = require("../controller/verifyOTP");

// check username
const checkUsername = require('../controller/user/checkUsername');




app.get("/", controller.homePage);


/* Create User */
app.post("/create/user", createUser);

app.get("/create-user", (req, res) => {
    res.render("userRegister");
});

/* Email Verification */
app.post("/user/register", sendOTP);
app.get("/user/register");

app.post("/user/verification", verifyOTP);

// check username
app.post('/check/username', checkUsername);


/* Delete user */
app.delete("/delete/user", deleteUser);


/* Create Creator */
app.get("/create/creator", (req, res) => {
    res.render("creatorRegister");
});

app.post("/create/creator",auth, createCreator);


/* Login User */
app.get("/login/user", controller.loginPage);
app.post("/login/user", userLogin);


/* Public  user profile */
app.get("/u/:id",userProfile);

/* Upload video */
app.get("/upload", (req, res) => {
    res.render("uploadVideo");
});

app.post("/upload", auth, upload.single("file"), uploadVideo);


/* Get All Videos */
app.get("/videos", getVideos);


/* Get Specific Video */
app.get("/video?:id", getVideo);


/* Delete Video */
app.post("/video/delete?:id", auth, deleteVideo);


/* Modify Video */
// app.post('/video/modify?:id');






module.exports = app;
