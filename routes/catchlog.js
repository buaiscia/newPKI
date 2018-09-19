const express = require("express");
const router = express.Router();
const app = express();
const fs = require('fs');



try {
    var logFile = fs.readFileSync('./log/log.txt', 'utf8');


} catch (e) {
    console.log('Error:', e.stack);
}


module.exports = logFile;