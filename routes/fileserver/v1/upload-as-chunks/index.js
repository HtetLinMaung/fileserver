const { brewBlankExpressFunc } = require("code-alchemy");
const fs = require("fs");
const path = require("path");
const multiparty = require("multiparty");
const { temporyFolderPath } = require("../../../../constants");
const { handleAuthorization } = require("../../../../services/auth");

module.exports = brewBlankExpressFunc(async (req, res) => {
  await handleAuthorization(req);
  const userTemporyFolder = path.join(temporyFolderPath, req.body.createdby);
  if (!fs.existsSync(userTemporyFolder)) {
    fs.mkdirSync(userTemporyFolder);
  }

  const form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    let filename = fields.filename[0];
    let hash = fields.hash[0];
    let chunk = files.chunk[0];
    let dir = path.join(userTemporyFolder, filename);
    // console.log(filename, hash, chunk)
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const buffer = fs.readFileSync(chunk.path);
      const ws = fs.createWriteStream(path.join(dir, hash));
      ws.write(buffer);
      ws.close();
      res.send(`${filename}-${hash} Section uploaded successfully`);
    } catch (error) {
      console.error(error);
      res.status(500).send(`${filename}-${hash} Section uploading failed`);
    }
  });
});
