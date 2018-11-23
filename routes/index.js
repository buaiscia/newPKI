const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const app = express();
var fs = require('fs');



// ROOT ROUTE

router.get("/", function(req, res) {
    delete require.cache[require.resolve('./loaded')];
    delete require.cache[require.resolve('./catchlog')];

    var logging = require("./catchlog");

    var allFiles = require("./loaded");


    res.render("landing", {
        logFile: logging.logFile,
        logTime: logging.logTime,
        allFiles: allFiles
    });
});




module.exports = router;