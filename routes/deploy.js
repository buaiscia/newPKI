#!/usr/bin/env node


"use strict";

const express = require("express");
const router = express.Router();
const app = express();
const exec = require("child_process").exec;
const bodyParser = require("body-parser");
const config = require("../config/config");


app.set("view engine", "ejs");


router.use(express.static(__dirname + "/public"));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//DEPLOY ROUTE


router.get("/", function (req, res) {

    let allFiles = require("./loaded", { allFiles: allFiles });

    res.render("deploy");
});


router.post("/", function (req, res) {

    const packageType = req.body.packageType;
    let environmentType = "";

    if (req.body.environment == config.env.uat2.name) {
        environmentType = config.env.uat2.address;

    } else if (req.body.environment == config.env.uat.name) {
        environmentType = config.env.uat.address;

    } else if (req.body.environment == config.env.prod.name) {
        environmentType = config.env.prod.address;

    }

    ///// PASSING ARGUMENT FILENAME TO SCRIPT
    let env = Object.create(process.env);
    env.package = process.argv;

    const packageToDeploy = req.body.allFiles;
    //var command = 'sh c:/users/alex.buaiscia/Documents/Developing/PKI_node/scripts/testdeploy.sh ' + fileToDeploy + ' ' + environmentType + ' >> ./log/log.txt'
    //var command = 'sh /var/www/html/newPKI/scripts/testdeploy.sh ' + packageToDeploy + ' >> ./log/log.txt'

    let packageInServer = "/home/appsupp/" + packageToDeploy;

    let command = "scp -i /home/appsupp/.ssh/id_rsa /var/www/html/newPKI/uploads/" + packageToDeploy + " appsupp@" + environmentType + ":/home/appsupp >> ./log/log.txt 2>&1";
    let command2 = "ssh -i /home/appsupp/.ssh/id_rsa appsupp@" + environmentType + " 'bash -s' < /var/www/html/newPKI/scripts/deploy.sh " + packageInServer + " " + packageType + " >> ./log/log.txt 2>&1";

    exec(command, { env: env }, function (error) {

        if (error) {
            return res.render("landing", { "error": error });
        }

        else {
            exec(command2, { env: env }, function (error, stderr) {

                delete require.cache[require.resolve("./catchlog")];
                delete require.cache[require.resolve("./synclog")];

                let logFile = require("./catchlog");
                let synclogging = require("./synclog");
                let allFiles = require("./loaded");

                if (error) {
                    return res.render("landing", { logFile: logFile, synclogging: synclogging, allFiles: allFiles, "error": stderr });
                }
                else {
                    return res.render("landing", {
                        logFile: logFile.logFile,
                        logTime: logFile.logTime,
                        synclogFile: synclogging.synclogFile,
                        synclogTime: synclogging.synclogTime,
                        allFiles: allFiles, "success": "successfully deployed"
                    });

                }
            });
        }

    });
});


module.exports = router;
