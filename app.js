//VAR AND PARAMETERS

const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    multer = require("multer"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    compression = require('compression');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));

app.use(flash());

// PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Sahaja yoga is supporting this",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());



// FLASH CONFIG
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

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