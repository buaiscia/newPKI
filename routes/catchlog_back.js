const express = require("express");
const router = express.Router();
const app = express();
const fs = require('fs');

app.disable('view cache');

var fileName = './log/log.txt';
var logFile = '';

// var logFile = fs.readFileSync(fileName, 'utf8');



function readContent(logFile) {
    fs.readFile(fileName, 'utf8', function(err, content) {
        if (err) return err;
        logFile(content);
    })
}

logFile = readContent(function(err, logFile) {
    console.log(logFile);
})


readContent(logFile);


module.exports = logFile;