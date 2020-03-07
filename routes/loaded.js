const fs = require("fs");
const uploadFolder = "./uploads";

function getFilesFromPath(path, extension) {
    let dir = fs.readdirSync(path);
    return dir.filter(elm => elm.match(new RegExp(`.*\.(${extension})`, "ig")));
}

let allFiles = getFilesFromPath(uploadFolder, ".gz");

module.exports = allFiles;
