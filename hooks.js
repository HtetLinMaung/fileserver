const fs = require("fs");
const connectMongoose = require("./utils/connect-mongoose");
const { storageFolderPath, temporyFolderPath } = require("./constants");

// const File = require("./models/File");

exports.beforeServerStart = async () => {
  await connectMongoose();

  // await File.deleteMany({});
  if (!fs.existsSync(storageFolderPath)) {
    fs.mkdirSync(storageFolderPath);
  }
  if (!fs.existsSync(temporyFolderPath)) {
    fs.mkdirSync(temporyFolderPath);
  }
};
