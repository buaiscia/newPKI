#!/usr/bin/env node


'use strict';

const express = require("express");
const router = express.Router();
const app = express();
var exec = require('child_process').exec;
const bodyParser = require("body-parser");
var config = require('../config/config');
var fs = require('fs');
var filePath = './log/syncLog.txt';


app.set("view engine", "ejs");


router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post("/", function(req, res) {

    console.log(req.body.packageType);

    var packageType = req.body.packageType;

    var env = Object.create(process.env);


    if (req.body.environment == config.env.uat.name) {
        var environmentType = config.env.uat.address;
        console.log(environmentType);

    } else if (req.body.environment == config.env.prod.name) {
        var environmentType = config.env.prod.address;
        console.log(environmentType);

    }

    var packageSyncType = req.body.packageSyncType;
    var syncType = req.body.syncType;

    //    var command = "ssh -i /home/appsupp/.ssh/id_rsa appsupp@" + environmentType + " 'bash -s' < /var/www/html/newPKI/scripts/sync.sh " + packageSyncType + " " + syncType + " >> ./log/syncLog.txt 2>&1"

    var command = "ssh -i /home/appsupp/.ssh/id_rsa appsupp@" + environmentType + " sudo /home/appsupp/rsync/sync_web.sh " + packageSyncType + " " + syncType + " >> ./log/syncLog.txt 2>&1"

    console.log(command);

    exec(command, { env: env }, function(error, stdout, stderr) {

        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        delete require.cache[require.resolve('./catchlog')];
        delete require.cache[require.resolve('./synclog')];

        fs.appendFileSync(filePath, '---------------------------------------\n', 'utf8');

        var logging = require("./catchlog");
        var synclogging = require("./synclog");
        var allFiles = require("./loaded");



        if (error) {

            return res.render("landing", { logFile: logging.logFile, allFiles: allFiles, "error": stderr });
        } else {
            return res.render("landing", {
                logFile: logging.logFile,
                logTime: logging.logTime,
                synclogFile: synclogging.synclogFile,
                synclogTime: synclogging.synclogTime,
                allFiles: allFiles,
                "success": "successfully synced"
            });

        }

    });

});

module.exports = router;