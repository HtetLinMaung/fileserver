const { brewBlankExpressFunc } = require("code-alchemy");
const fs = require("fs");
const path = require("path");
const { storageFolderPath } = require("../../../../constants");
const File = require("../../../../models/File");
const { handleAuthorization } = require("../../../../services/auth");

module.exports = brewBlankExpressFunc(async (req, res) => {
  await handleAuthorization(req);
  const userStorageFolder = path.join(storageFolderPath, req.body.createdby);
  if (!fs.existsSync(userStorageFolder)) {
    fs.mkdirSync(userStorageFolder);
  }
  const { file, name } = req.body;
  const f = new File({ name, createdby: req.body.createdby });
  await f.save();
  f.location = path.join(userStorageFolder, name);
  fs.writeFileSync(f.location, Buffer.from(file.split("base64,")[1], "base64"));
  await f.save();

  res.json({
    code: 200,
    message: "File uploaded successful.",
  });
});
