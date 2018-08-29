#!/usr/bin/env node

'use strict';

const express = require("express");
const router = express.Router();
const app = express();
const shell = require('shelljs');

app.set("view engine", "ejs");


router.use(express.static(__dirname + '/public'));

//DEPLOY ROUTE


router.get("/", function(req, res) {
    res.render("deploy");
});


router.post("/", function(req, res) {
    console.log("I'm in the deploy JS");
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




module.exports = router;