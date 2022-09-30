const { brewBlankExpressFunc } = require("code-alchemy");
const youtube = require("youtube-audio-stream");

module.exports = brewBlankExpressFunc(async (req, res) => {
  const { url, filename } = req.query;
  console.log(url);
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "audio/mpeg");
  const stream = youtube(url);
  console.log(stream);
  stream.pipe(res);
});
