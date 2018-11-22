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


app.set("view engine", "ejs");


router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//SYNC ROUTE

router.post("/", function(req, res) {
    //delete require.cache[require.resolve('./loaded')];
    console.log("I'm in the sync JS");

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
    // env.package = process.argv;

    // var array1 = env.package;

    // console.log(array1.slice(1, -1));
    // var fileToDeploy = array1.slice(1, -1);
    // console.log(req.body.allFiles);
    // var packageToDeploy = req.body.allFiles
    //var command = 'sh c:/users/alex.buaiscia/Documents/Developing/PKI_node/scripts/testdeploy.sh ' + fileToDeploy + ' ' + environmentType + ' >> ./log/log.txt'
    //var command = 'sh /var/www/html/newPKI/scripts/testdeploy.sh ' + packageToDeploy + ' >> ./log/log.txt'

    // var packageInServer = "/home/appsupp/" + packageToDeploy

    var packageSyncType = req.body.packageSyncType;
    var syncType = req.body.syncType;



    // exec("sudo ssh -i /home/appsupp/.ssh/id_rsa -t appsupp@$sync_env 'sudo /home/appsupp/rsync/sync_web.sh $pack_sync $type_sync' 2>&1", $output);

    // var command = 'ssh -i /home/appsupp/.ssh/id_rsa appsupp@' + environmentType + " 'bash -s' < /var/www/html/newPKI/scripts/sync.sh " + packageSyncType + " " + syncType + " >> ./log/syncLog.txt 2>&1"
    var command = "ssh -i /home/appsupp/.ssh/id_rsa appsupp@" + environmentType + " /home/appsupp/rsync/sync.sh " + packageSyncType + " " + syncType + " >> ./log/syncLog.txt 2>&1"
        // var command2 = 'ssh -i /home/appsupp/.ssh/id_rsa appsupp@' + environmentType + " 'bash -s' < /var/www/html/newPKI/scripts/deploy.sh " + packageInServer + " " + packageType + " >> ./log/log.txt 2>&1"
        // var command = 'scp -v -i /home/appsupp/.ssh/id_rsa /var/www/html/PKI/' + packageToDeploy + ' appsupp@' + environmentType + ':/home/appsupp >> ./log/log.txt 2>&1'

    console.log(command);



    exec(command, { env: env }, function(error, stdout, stderr) {

        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        delete require.cache[require.resolve('./catchlog')];

        var logFile = require("./catchlog");
        // var allFiles = require("./loaded");


        if (error) {

            return res.render("landing", { logFile: logFile, "error": error });
        } else {
            return res.render("landing", { logFile: logFile, "success": "successfully synced" });

        }

        //      else
        //
        //            return res.render("landing", { logFile: logFile, allFiles: allFiles, "success": "successfully deployed" });
    });



});


module.exports = router;