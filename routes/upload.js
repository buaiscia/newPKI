"use strict";

const express = require("express");
const router = express.Router();
const app = express();

const formidable = require("formidable");
const fs = require("fs");
const bodyParser = require("body-parser");
const util = require("util");

app.set("view engine", "ejs");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(__dirname + "/public"));

router.post("/", function (req, res, next) {
    delete require.cache[require.resolve("./loaded")];
    let form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.multiples = true;

    form.on("file", function (field, file) {
        fs.rename(file.path, form.uploadDir + "/" + file.name, function (error) {
            if (error) {
                console.log(error);
            }
        });
    });

    form.on("error", function (err) {
        console.log("an error has occured with form upload");
        console.log(err);
    });

    form.parse(req, function (err, fields, files, fileName, fileSize) {
        if (err) next(err);
        fileName = util.inspect(files.upload.name);
        fileSize = util.inspect(files.upload.size);

        process.argv = fileName;

        delete require.cache[require.resolve("./catchlog")];
        delete require.cache[require.resolve("./synclog")];

        var logging = require("./catchlog");
        var synclogging = require("./synclog");
        var allFiles = require("./loaded");

        if (err) {
            return res.render("landing", { logFile: logging }, { "error": err });
        }
        return res.render("landing", {
            fileName: fileName,
            fileSize: fileSize,
            logFile: logging.logFile,
            logTime: logging.logTime,
            synclogFile: synclogging.synclogFile,
            synclogTime: synclogging.synclogTime,
            allFiles: allFiles, "success": "The file has been successfully uploaded"
        });
    });

    form.on("end", function () {
        console.log("-> upload done");
    });

});

module.exports = router;
