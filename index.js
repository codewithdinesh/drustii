const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require('./routes/routes');


// Middlewares
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use('/', router);


const port = 5001;

app.listen(port, () => {

  console.log("server started on " + port);

});