const express = require('express');
const config = require('../config/config');
const Mongoose = require('mongoose');
const app = express.Router();
const Fileupload = require('../controller/FileUpload');
const upload = Fileupload.upload;

const controller = require("../controller/controller")

const createUser = require("../controller/user/createUser");

const createCreator = require('../controller/creator/createCreator');

const auth = require("../middleware/auth");

const userLogin = require('../controller/user/userLogin');

const creatorLogin = require('../controller/creator/creatorLogin');

const uploadVideo = require('../controller/videos/uploadVideo');

app.get("/", controller.homePage);


app.post("/upload", auth, upload.single("file"), uploadVideo);

app.post('/create/user', createUser);
app.get('/create-user', (req, res) => {

    res.render('userRegister')
})

app.get('/create/creator', (req, res) => {

    res.render('creatorRegister')
})
app.post('/create/creator', createCreator);

app.post('/login/user', userLogin);

app.post('/login/creator', creatorLogin);

app.get('/login/user', controller.loginPage);

app.get('/login/creator', (req, res) => {
    res.render('creatorLogin');
})

app.get("/videos", controller.videos);

app.get("/video/:id", controller.getVideo);

app.post("/video/del/:id", controller.deleteVideo);

module.exports = app;