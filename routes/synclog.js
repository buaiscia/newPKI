const express = require("express");
const router = express.Router();
const app = express();
const fs = require('fs');
const util = require('util');


app.disable('view cache');


var filePath = './log/syncLog.txt';

function synclogFile() {
    
   
    buf = fs.readFileSync(filePath, 'utf8');

    str = buf.toString();

    logFileTemp = str.split('\n');
    synclogFile = logFileTemp.slice(Math.max(logFileTemp.length - 40));

    return synclogFile;
}

function synclogTime() {
    stats = fs.statSync(filePath);
    synclogTime = new Date(util.inspect(stats.mtime));

    return synclogTime;
}

var synclogFile = synclogFile();
var synclogTime = synclogTime();


module.exports.synclogFile = synclogFile;
module.exports.synclogTime = synclogTime;





