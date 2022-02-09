require("dotenv").config();
const express = require("express");
const app = express();
const router = require('./routes/routes');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

// Middlewares
app.use(express.json());
app.use(cookieParser())
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/* 
//For sub domain
app.use(function (req, res, next) {
  if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www') return next();
  // otherwise we have subdomain here
  var subdomain = req.subdomains.slice(-1)[0];
  // keep it
  req.subdomain = subdomain;
  next();
});

 */
app.use('/', router);

const port = process.env.PORT || 5001;

app.listen(port, () => {

  console.log("server started on " + port);

});