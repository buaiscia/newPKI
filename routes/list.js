const express = require("express");
const router = express.Router();
const app = express();
var formidable = require('formidable');
const dirname = './uploads/';
const fs = require('fs');
app.use(express.static(__dirname + '/public'));


// function readFiles(dirname, onFileContent, onError) {
//     fs.readdir('./uploads/', function(err, filenames) {
//         if (err) {
//             onError(err);
//             return;
//         }
//         filenames.forEach(function(filename) {
//             fs.readFile('./uploads/' + filename, 'utf-8', function(err, content) {
//                 if (err) {
//                     onError(err);
//                     return;
//                 }
//                 onFileContent(filename, content);
//                 console.log(onFileContent);
//             });
//         });
//     });
// }

// var data = {};
// readFiles('dirname/', function(filename, content) {
//     data[filename] = content;
// }, function(err) {
//     throw err;
// });


// var glob = require('glob-fs')({ gitignore: true });
// var files = glob.readdirSync('/uploads/*');

// glob.readdirStream('/uploads/*')
//     .on('data', function(file) {

//         let fileName = file.name;
//         console.log(fileName);
//         return fileName;
//     })
//     .on('error', console.error);






// console.log(files);




// LIST ROUTE

// router.get("/", function(req, res) {
//     fs.readdir(testFolder, (err, files) => {
//         files.forEach(file => {
//             console.log(file);
//         });
//     })

//     res.redirect("/landing");
// });

module.exports = router;