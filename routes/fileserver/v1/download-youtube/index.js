const { brewBlankExpressFunc } = require("code-alchemy");
const ytdl = require("ytdl-core");

module.exports = brewBlankExpressFunc(async (req, res) => {
  const url = req.query.url;
  delete req.query.url;
  ytdl(url, { filter: "audioandvideo", ...req.query }).pipe(res);
});
