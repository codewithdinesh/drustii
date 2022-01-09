const mongoose = require("mongoose");
const config = require('../config/config');


// DB
const mongoURI = config.url;


// connection
const conCreate = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const conConnect = mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = {
    conCreate, conConnect
}