const { brewBlankExpressFunc } = require("code-alchemy");
const fs = require("fs");
const File = require("../../../../models/File");
const mime = require("mime");

module.exports = brewBlankExpressFunc(async (req, res) => {
  const file = await File.findById(req.query.id);
  if (!file) {
    return res.status(404).send("File not found!");
  }

  res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
  res.setHeader("Content-Type", mime.getType(file.location));

  const filestream = fs.createReadStream(file.location);
  filestream.pipe(res);
});
