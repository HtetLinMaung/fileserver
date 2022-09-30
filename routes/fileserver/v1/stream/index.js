const { brewBlankExpressFunc } = require("code-alchemy");
const fs = require("fs");
const File = require("../../../../models/File");
const mime = require("mime");

module.exports = brewBlankExpressFunc(async (req, res) => {
  const file = await File.findById(req.query.id);
  if (!file) {
    return res.status(404).send("File not found!");
  }
  const mimetype = mime.getType(file.location);
  const stat = fs.statSync(file.location);
  const range = req.headers.range;
  let readStream;
  // if there is no request about range
  if (range) {
    // remove 'bytes=' and split the string by '-'
    const parts = range.replace(/bytes=/, "").split("-");

    const partial_start = parts[0];
    const partial_end = parts[1];

    if (
      (isNaN(partial_start) && partial_start.length > 1) ||
      (isNaN(partial_end) && partial_end.length > 1)
    ) {
      return res.sendStatus(500);
    }
    // convert string to integer (start)
    const start = parseInt(partial_start, 10);
    // convert string to integer (end)
    // if partial_end doesn't exist, end equals whole file size - 1
    const end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
    // content length
    const content_length = end - start + 1;

    res.status(206).header({
      "Content-Type": mimetype,
      "Content-Length": content_length,
      "Content-Range": "bytes " + start + "-" + end + "/" + stat.size,
    });

    // Read the stream of starting & ending part
    readStream = fs.createReadStream(file.location, { start, end });
  } else {
    res.header({
      "Content-Type": mimetype,
      "Content-Length": stat.size,
    });
    readStream = fs.createReadStream(file.location);
  }
  readStream.pipe(res);
});
