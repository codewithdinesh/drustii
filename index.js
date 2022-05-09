require("dotenv").config();
const express = require("express");
const app = express();
const router = require('./routes/routes')
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize');

// Middlewares
app.use(express.json());
app.use(cookieParser())
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', router);

const port = process.env.PORT || 5001;

app.listen(port, () => {

  console.log("server started on " + port);

});



