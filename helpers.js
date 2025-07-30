const fs = require('node:fs');
const path = require('path');

let fileUrl = path.join(__dirname, "file.json");

function readUsers() { 
    let data = fs.readFileSync(fileUrl, "utf-8");

    return JSON.parse(data);
}


function writeUsers(users) {
    fs.writeFileSync(fileUrl, JSON.stringify(users, null, 2), "utf-8");
}

module.exports = { readUsers, writeUsers };