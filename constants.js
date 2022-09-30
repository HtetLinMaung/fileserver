const path = require("path");

exports.rootPath = __dirname;

exports.storageFolderPath = path.join(__dirname, "storage");

// Temporary path to upload files
exports.temporyFolderPath = path.join(this.storageFolderPath, "temporary");
