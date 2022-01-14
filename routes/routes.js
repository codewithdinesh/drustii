const express = require('express');
const app = express.Router();
const Fileupload = require('../controller/FileUpload');
const upload = Fileupload.upload;
const controller = require("../controller/controller")

/* User Login and creation */
const createUser = require("../controller/user/createUser");
const userLogin = require('../controller/user/userLogin');

/* Creator Login and creation */
const createCreator = require('../controller/creator/createCreator');
const creatorLogin = require('../controller/creator/creatorLogin');

/* Authentication Middelware */
const auth = require("../middleware/auth");

/* Videos oprations */
const uploadVideo = require('../controller/videos/uploadVideo');
const getVideos = require('../controller/videos/getVideos');
const getVideo = require('../controller/videos/getVideo');
const deleteVideo = require('../controller/videos/deleteVideo');

app.get("/", controller.homePage);

/* Upload video */
app.get('/upload', (req, res) => {
    res.render('uploadVideo')
});

app.post("/upload", auth, upload.single("file"), uploadVideo);

/* Create User */
app.post('/create/user', createUser);

app.get('/create-user', (req, res) => {
    res.render('userRegister')
})

/* Create Creator */
app.get('/create/creator', (req, res) => {
    res.render('creatorRegister')
})

app.post('/create/creator', createCreator);

/* Login User */
app.get('/login/user', controller.loginPage);
app.post('/login/user', userLogin);

/* Login Creator */
app.get('/login/creator', (req, res) => {
    res.render('creatorLogin');
});
app.post('/login/creator', creatorLogin);

/* Get All Videos */
app.get("/videos", getVideos);

/* Get Specific Video */
app.get("/video?:id", getVideo);

/* Delete Video */
app.delete('/video/delete?:id', auth, deleteVideo);

/* Modify Video */
// app.post('/video/modify?:id');

module.exports = app;