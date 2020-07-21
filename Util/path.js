const path = require("path");

let root = path.join(path.dirname(process.mainModule.filename), "../");
module.exports = root;
