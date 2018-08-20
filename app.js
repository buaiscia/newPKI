//VAR AND PARAMETERS

const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    multer = require("multer"),
    methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));


// REQUIRING ROUTES

var indexRoute = require("./routes/index");
var uploadRoute = require("./routes/upload");
var deployRoute = require("./routes/deploy");
// var listRoute = require("./routes/list");



app.use("/", indexRoute);
app.use("/upload", uploadRoute);
app.use("/deploy", deployRoute);
// app.use("/list", listRoute);


// SERVER

app.listen(3000, function() {
    console.log("The  Server Has Started on port 3000");
});