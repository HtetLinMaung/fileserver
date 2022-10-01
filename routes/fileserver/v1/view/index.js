const { brewBlankExpressFunc } = require("code-alchemy");
const fs = require("fs");
const File = require("../../../../models/File");
const mime = require("mime");
const { verifyToken } = require("../../../../services/auth");

module.exports = brewBlankExpressFunc(async (req, res) => {
  const { id, token } = req.query;
  const file = await File.findById(id);
  if (!file) {
    return res.status(404).send("File not found!");
  }
  if (file.private) {
    const [response, err] = await verifyToken(token);
    if (
      err ||
      response.data.data.code != 200 ||
      response.data.data.userId != file.createdby
    ) {
      return res.status(401).send("Unauthorized!");
    }
  }
  res.setHeader("Content-Disposition", `inline; filename=${file.name}`);
  res.setHeader("Content-Type", mime.getType(file.location));
  const filestream = fs.createReadStream(file.location);
  filestream.pipe(res);
});
