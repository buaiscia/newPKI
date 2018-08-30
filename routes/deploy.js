#!/usr/bin/env node

'use strict';

const express = require("express");
const router = express.Router();
const app = express();
const shell = require('shelljs');
var exec = require('child_process').exec;
const bodyParser = require("body-parser");
var config = require('../config/config');


app.set("view engine", "ejs");


router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//DEPLOY ROUTE


router.get("/", function(req, res) {
    res.render("deploy");
});


router.post("/", function(req, res) {
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

    var command = 'sh ./scripts/test.sh ' + packageType + ' ' + environmentType + ' >> log.txt'

    // env.environmentType = process.argv;
    // for (let j = 0; j < process.argv.length; j++) {
    //     console.log(j + ' -> ' + (process.argv[j]));
    // }
    // var packageFile = process.argv;
    // console.log(packageFile);


    // console.log(array);
    // shell.exec(`sh ./scripts/test.sh >> log.txt`, { env: env });
    exec(command, { env: env }, function(error, stdout, stderr) {
        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    });

    // shell.exec(`sh ./scripts/testtar.sh`);

    // shell.exec("/scripts/test.sh")
    ;
    res.redirect("/deploy");

});


// function packType(parms, res) {
//     var packageType = +parms.packageType;
//     console.log(packageType);
// }

module.exports = router;