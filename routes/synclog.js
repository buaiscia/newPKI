const express = require("express");
const app = express();
const fs = require("fs");
const util = require("util");


app.disable("view cache");


let filePath = "./log/syncLog.txt";

function synclogFile() {
    
   
    let buf = fs.readFileSync(filePath, "utf8");
    let str = buf.toString();
    let logFileTemp = str.split("\n");
    let synclogFile = logFileTemp.slice(Math.max(logFileTemp.length - 40));

    return synclogFile;
}

function synclogTime() {
    let stats = fs.statSync(filePath);
    let synclogTime = new Date(util.inspect(stats.mtime));

    return synclogTime;
}

let syncedlogFile = synclogFile();
let syncedlogTime = synclogTime();


module.exports.synclogFile = syncedlogFile;
module.exports.synclogTime = syncedlogTime;





