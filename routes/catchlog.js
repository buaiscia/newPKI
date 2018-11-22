const express = require("express");
const router = express.Router();
const app = express();
const fs = require('fs');

app.disable('view cache');


var filePath = './log/log.txt';


var buf = fs.readFileSync(filePath, 'utf8');
var str = buf.toString();
// var logFile = (buf.match(/\n/g) || []).length;

var logFile = str.split('\n');
console.log(logFile);



module.exports = logFile;