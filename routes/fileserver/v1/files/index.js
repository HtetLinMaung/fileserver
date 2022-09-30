const { brewBlankExpressFunc } = require("code-alchemy");
const File = require("../../../../models/File");

module.exports = brewBlankExpressFunc(async (req, res) => {
  const data = await File.find();
  res.json({
    code: 200,
    message: "Files fetched successful.",
    data,
  });
});
