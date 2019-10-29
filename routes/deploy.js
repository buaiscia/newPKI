#!/usr/bin/env node


'use strict';

const express = require("express");
const router = express.Router();
const app = express();
var exec = require('child_process').exec;
const bodyParser = require("body-parser");
var config = require('../config/config');


app.set("view engine", "ejs");


router.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//DEPLOY ROUTE


router.get("/", function(req, res) {
    
	var allFiles = require("./loaded", {allFiles: allFiles});

    	res.render("deploy");
});


router.post("/", function(req, res) {
  
    console.log("I'm in the deploy JS");

    ///// PASSING ARGUMENT OF TYPE OF PACKAGE TO DEPLOY

    console.log(req.body.packageType);
    var packageType = req.body.packageType;


    ///// PASSING ARGUMENT OF ENVIORONMENT

    // console.log(req.body.environment);
    
    if(req.body.environment == config.env.uat2.name) {
	var environmentType = config.env.uat2.address;
	console.log(environmentType);

	} else if (req.body.environment == config.env.uat.name) {
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
    
	var command = 'scp -i /home/appsupp/.ssh/id_rsa /var/www/html/newPKI/uploads/' + packageToDeploy + ' appsupp@' + environmentType + ':/home/appsupp >> ./log/log.txt 2>&1'
	var command2 = 'ssh -i /home/appsupp/.ssh/id_rsa appsupp@' + environmentType + " 'bash -s' < /var/www/html/newPKI/scripts/deploy.sh " + packageInServer + " " + packageType + " >> ./log/log.txt 2>&1"

    console.log(command);
    console.log(command2);	


    exec(command, { env: env }, function(error, stdout, stderr) {

        console.log('done')
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        
	if(error) {
            return res.render("landing", { "error": error });
        } 

	else {
		exec(command2, {env: env}, function(error, stderr){
			        console.log('stderr:', stderr);


		                delete require.cache[require.resolve('./catchlog')];
		                delete require.cache[require.resolve('./synclog')];

			        var logFile = require("./catchlog");
				var synclogging = require("./synclog");
        			var allFiles = require("./loaded");


				
			if(stderr) { 
				 return res.render("landing", { logFile: logFile, synclogging: synclogging, allFiles: allFiles, "error": stderr });	
			}
			else { 
				return res.render("landing", {
                                                logFile: logFile.logFile,
                                                logTime: logFile.logTime,
                                                synclogFile: synclogging.synclogFile,
                                                synclogTime: synclogging.synclogTime,
                                                allFiles: allFiles, "success": "successfully deployed" });
				
			}
		});
	}

    });



});


module.exports = router;
