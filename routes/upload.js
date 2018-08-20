'use strict';

const express = require("express");
const router = express.Router();
const app = express();


// const fileUpload = require("express-fileupload");
// var multer = require("multer");
var formidable = require('formidable');
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var util = require('util');
var fs = require('fs');

app.set("view engine", "ejs");


router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(__dirname + '/public'));



// router.use(fileUpload());


//UPLOAD ROUTE



// router.get("/", function(req, res) {

//     res.render("upload");
// });


router.post("/", function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = './uploads';
    form.keepExtensions = true;
    form.multiples = true;


    // });
    // form.on('file', function(name, file) {
    //     console.log("Got file ", file);
    // });
    form.on('file', function(field, file) {
        fs.rename(file.path, form.uploadDir + "/" + file.name, function(error) {
            if (error) {
                console.log(error);
            }
        });
    });

    form.on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
    });



    form.parse(req, function(err, fields, files) {
        if (err) next(err);
        var fileName = util.inspect(files.upload.name);
        var fileSize = util.inspect(files.upload.size);

        //test arguments
        process.argv = fileName;
        for (let j = 0; j < process.argv.length; j++) {
            console.log(j + ' -> ' + (process.argv[j]));
        }
        //
        res.render('./landing', { fileName: fileName, fileSize: fileSize });
    });

    form.on('end', function() {
        console.log('-> upload done');
    });

});




//         // ADD FLASH MESSAGE FOR FILE UPLOADED AND BACK





module.exports = router;