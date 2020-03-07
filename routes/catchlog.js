const express = require("express");
const app = express();
const fs = require("fs");
const util = require("util");


app.disable("view cache");


const filePath = "./log/log.txt";

function logFile() {

    let buf = fs.readFileSync(filePath, "utf8");
    let str = buf.toString();
    let logFileTemp = str.split("\n");
    let logFile = logFileTemp.slice(Math.max(logFileTemp.length - 34));
    return logFile;
}

function logTime() {
    let stats = fs.statSync(filePath);
    let logTime = new Date(util.inspect(stats.mtime));
    return logTime;
}

let loggedFile = logFile();
let loggedTime = logTime();


module.exports.logFile = loggedFile;
module.exports.logTime = loggedTime;


























