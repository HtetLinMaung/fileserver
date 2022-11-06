const { brewBlankExpressFunc } = require("code-alchemy");
const { expressStreamMedia } = require("code-alchemy/stream");
const File = require("../../../../models/File");
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
  expressStreamMedia(file.location, req, res);
});
