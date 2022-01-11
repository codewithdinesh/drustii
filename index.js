require("dotenv").config();
const express = require("express");
const app = express();
const router = require('./routes/routes');
var cookieParser = require('cookie-parser');

// Middlewares
app.use(express.json());
app.use(cookieParser())
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use('/', router);

const port = process.env.PORT || 5001;

app.listen(port, () => {

  console.log("server started on " + port);

});