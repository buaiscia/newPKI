const express = require("express");
const router = express.Router();



// ROOT ROUTE

router.get("/", function (req, res) {
    delete require.cache[require.resolve('./loaded')];
    delete require.cache[require.resolve('./catchlog')];
    delete require.cache[require.resolve('./synclog')];

    var logging = require("./catchlog");

    var synclogging = require("./synclog");


    var allFiles = require("./loaded");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.
    res.render("landing", {
        logFile: logging.logFile,
        logTime: logging.logTime,
        synclogFile: synclogging.synclogFile,
        synclogTime: synclogging.synclogTime,
        allFiles: allFiles
    });
});




module.exports = router;
