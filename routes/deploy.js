#!/usr/bin/env node

'use strict';

const express = require("express");
const router = express.Router();
const app = express();
const shell = require('shelljs');
const bodyParser = require("body-parser");


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

    // packType(req.body, res);
    console.log(req.body.packageType);

    ///// PASSING ARGUMENT FILENAME TO SCRIPT
    var env = Object.create(process.env);
    env.package = process.argv;
    // for (let j = 0; j < process.argv.length; j++) {
    //     console.log(j + ' -> ' + (process.argv[j]));
    // }
    // var packageFile = process.argv;
    // console.log(packageFile);


    // console.log(array);
    shell.exec(`sh ./scripts/test.sh $package >> log.txt`, { env: env });

    // shell.exec("/scripts/test.sh")
    ;
    res.redirect("/deploy");

});


// function packType(parms, res) {
//     var packageType = +parms.packageType;
//     console.log(packageType);
// }

module.exports = router;