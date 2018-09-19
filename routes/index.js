const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const app = express();
var fs = require('fs');




// ROOT ROUTE

router.get("/", function(req, res) {
    var logFile = require("./catchlog");

    var allFiles = require("./loaded");

    res.render("landing", { logFile: logFile, allFiles: allFiles });
});




module.exports = router;