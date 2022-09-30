const path = require("path");
const fs = require("fs");
const { brewBlankExpressFunc } = require("code-alchemy");
const { handleAuthorization } = require("../../../../services/auth");
const {
  storageFolderPath,
  temporyFolderPath,
} = require("../../../../constants");
const File = require("../../../../models/File");

module.exports = brewBlankExpressFunc(async (req, res) => {
  await handleAuthorization(req);
  const userStorageFolder = path.join(storageFolderPath, req.body.createdby);
  const userTemporyFolder = path.join(temporyFolderPath, req.body.createdby);
  if (!fs.existsSync(userStorageFolder)) {
    fs.mkdirSync(userStorageFolder);
  }
  if (!fs.existsSync(userTemporyFolder)) {
    fs.mkdirSync(userTemporyFolder);
  }

  const { filename } = req.query;

  let len = 0;
  const bufferList = fs
    .readdirSync(path.join(userTemporyFolder, filename))
    .sort((a, b) => a - b)
    .map((hash) => {
      const buffer = fs.readFileSync(
        path.join(userTemporyFolder, filename, hash)
      );
      len += buffer.length;
      return buffer;
    });
  //Merge files
  const buffer = Buffer.concat(bufferList, len);
  const location = path.join(userStorageFolder, filename);
  const ws = fs.createWriteStream(location);
  ws.write(buffer);
  ws.close();
  const f = new File({
    name: filename,
    location,
    createdby: req.body.createdby,
  });
  await f.save();
  fs.rmSync(path.join(userTemporyFolder, filename), { recursive: true });
  res.send(`Section merge completed`);
});
