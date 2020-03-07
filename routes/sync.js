#!/usr/bin/env node


"use strict";

const express = require("express");
const router = express.Router();
const app = express();
const exec = require("child_process").exec;
const bodyParser = require("body-parser");
const config = require("../config/config");
const fs = require("fs");
const filePath = "./log/syncLog.txt";


app.set("view engine", "ejs");


router.use(express.static(__dirname + "/public"));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post("/", function (req, res) {

    let environmentType = "";

    const env = Object.create(process.env);

    if (req.body.environment == config.env.uat2.name) {
        environmentType = config.env.uat2.address;

    } else if (req.body.environment == config.env.uat.name) {
        environmentType = config.env.uat.address;

    } else if (req.body.environment == config.env.prod.name) {
        environmentType = config.env.prod.address;

    }

    const packageSyncType = req.body.packageSyncType;
    const syncType = req.body.syncType;

    //    var command = "ssh -i /home/appsupp/.ssh/id_rsa appsupp@" + environmentType + " 'bash -s' < /var/www/html/newPKI/scripts/sync.sh " + packageSyncType + " " + syncType + " >> ./log/syncLog.txt 2>&1"

    let command = "ssh -i /home/appsupp/.ssh/id_rsa appsupp@" + environmentType + " sudo /home/appsupp/rsync/sync_web.sh " + packageSyncType + " " + syncType + " >> ./log/syncLog.txt 2>&1";

    exec(command, { env: env }, function (error, stdout, stderr) {

        console.log("done");
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);

        delete require.cache[require.resolve("./catchlog")];
        delete require.cache[require.resolve("./synclog")];

        fs.appendFileSync(filePath, "---------------------------------------\n", "utf8");

        let logging = require("./catchlog");
        let synclogging = require("./synclog");
        let allFiles = require("./loaded");



        if (error) {

            return res.render("landing", { logFile: logging.logFile, allFiles: allFiles, "error": stderr });
        } else {
            return res.render("landing", {
                logFile: logging.logFile,
                logTime: logging.logTime,
                synclogFile: synclogging.synclogFile,
                synclogTime: synclogging.synclogTime,
                allFiles: allFiles, "success": "successfully synced"
            });

        }

    });

});

module.exports = router;


