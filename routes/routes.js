const express = require('express');

const config = require('../config/config');

const Mongoose = require('mongoose');

const app = express.Router();
const Fileupload = require('../controller/FileUpload');
const upload = Fileupload.upload;

const controller = require("../controller/controller")

const createUser=require("../controller/user/createUser");


app.get("/", controller.homePage);


app.post("/upload", upload.single("file"), controller.uploadPage);

app.post('/create-user',controller.createUser);
app.get('/create-user',(req,res)=>{

    res.render('userRegister')
})

app.post('/create-creator',controller.createCreator);

app.post('/login',controller.userlogin);

app.get('/login',controller.loginPage);

app.get("/videos", controller.videos);

app.get("/video/:id", controller.getVideo);

app.post("/video/del/:id", controller.deleteVideo);

module.exports = app;