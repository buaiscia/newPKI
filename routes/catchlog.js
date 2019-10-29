const express = require("express");
const router = express.Router();
const app = express();
const fs = require('fs');
const util = require('util');


app.disable('view cache');


var filePath = './log/log.txt';

function logFile() {
  
    buf = fs.readFileSync(filePath, 'utf8');
    str = buf.toString();
    

    logFileTemp = str.split('\n');
    logFile = logFileTemp.slice(Math.max(logFileTemp.length - 34));

    return logFile;
}

function logTime() {
    stats = fs.statSync(filePath);
    logTime = new Date(util.inspect(stats.mtime));

    return logTime;
}

var logFile = logFile();
var logTime = logTime();


module.exports.logFile = logFile;
module.exports.logTime = logTime;


























