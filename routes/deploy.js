#!/usr/bin/env node


'use strict';

const express = require("express");
const router = express.Router();
const app = express();
const shell = require('shelljs');
var exec = require('child_process').exec;
const bodyParser = require("body-parser");
var config = require('../config/config');
var fs = require('fs');
var filePath = './log/log.txt';


app.set("view engine", "ejs");


router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//DEPLOY ROUTE


router.get("/", function(req, res) {
    //delete require.cache[require.resolve('./loaded')];
    var allFiles = require("./loaded", { allFiles: allFiles });

    res.render("deploy");
});


router.post("/", function(req, res) {
    //delete require.cache[require.resolve('./loaded')];
    console.log("I'm in the deploy JS");

    ///// PASSING ARGUMENT OF TYPE OF PACKAGE TO DEPLOY

    console.log(req.body.packageType);
    var packageType = req.body.packageType;


    ///// PASSING ARGUMENT OF ENVIORONMENT

    // console.log(req.body.environment);
    if (req.body.environment == config.env.uat.name) {
        var environmentType = config.env.uat.address;
        console.log(environmentType);

    } else if (req.body.environment == config.env.prod.name) {
        var environmentType = config.env.prod.address;
        console.log(environmentType);

    }
    // console.log(req.body.environment);

    ///// PASSING ARGUMENT FILENAME TO SCRIPT
    var env = Object.create(process.env);
    env.package = process.argv;

    // var array1 = env.package;

    // console.log(array1.slice(1, -1));
    // var fileToDeploy = array1.slice(1, -1);
    // console.log(req.body.allFiles);
    var packageToDeploy = req.body.allFiles
        //var command = 'sh c:/users/alex.buaiscia/Documents/Developing/PKI_node/scripts/testdeploy.sh ' + fileToDeploy + ' ' + environmentType + ' >> ./log/log.txt'
        //var command = 'sh /var/www/html/newPKI/scripts/testdeploy.sh ' + packageToDeploy + ' >> ./log/log.txt'

    var packageInServer = "/home/appsupp/" + packageToDeploy

    var command = 'scp -v -i /home/appsupp/.ssh/id_rsa /var/www/html/newPKI/uploads/' + packageToDeploy + ' appsupp@' + environmentType + ':/home/appsupp >> ./log/log.txt 2>&1'
    var command2 = 'ssh -i /home/appsupp/.ssh/id_rsa appsupp@' + environmentType + " 'bash -s' < /var/www/html/newPKI/scripts/deploy.sh " + packageInServer + " " + packageType + " >> ./log/log.txt 2>&1"

    var takelog = 'scp -v appsupp@' + environmentType + ':/home/appsupp/logging.txt /var/www/html/newPKI/log/ >> ./log/logoflog.txt 2>&1'

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



        if (err) {

            return res.render("landing", { logFile: logFile, allFiles: allFiles, "error": err });
        } else {
            exec(command2, { env: env }, function(error, err) {
                console.log('stderr:', err);

                fs.appendFileSync(filePath, '---------------------------------------\n', 'utf8');

                var logFile = require("./catchlog");
                var synclogging = require("./synclog");
                var allFiles = require("./loaded");


                if (err) {
                    return res.render("landing", { logFile: logFile, allFiles: allFiles, "error": err });
                } else

                    exec(takelog, { env: env }, (err) => {
                    if (err) { return res.render("landing", { logFile: logFile, allFiles: allFiles, "error": err }); } else
                        return res.render("landing", {
                            logFile: logging.logFile,
                            logTime: logging.logTime,
                            synclogFile: synclogging.synclogFile,
                            synclogTime: synclogging.synclogTime,
                            allFiles: allFiles,
                            "success": "successfully deployed"
                        })


                });
            });
        }

        //	else
        //
        //            return res.render("landing", { logFile: logFile, allFiles: allFiles, "success": "successfully deployed" });
    });



});


module.exports = router;