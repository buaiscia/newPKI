const express = require("express");
const router = express.Router();
const app = express();
const fs = require('fs');
const uploadFolder = "./uploads";
var path = require('path');


function getFilesFromPath(path, extension) {
    let dir = fs.readdirSync(path);
    return dir.filter(elm => elm.match(new RegExp(`.*\.(${extension})`, 'ig')));
}

var allFiles = getFilesFromPath(uploadFolder, ".sql");
console.log(getFilesFromPath(uploadFolder, ".sql"));







module.exports = allFiles;