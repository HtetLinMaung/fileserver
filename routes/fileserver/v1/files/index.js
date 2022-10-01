const { brewExpressFuncCreateOrFindAll } = require("code-alchemy");
const path = require("path");
const fs = require("fs");
const File = require("../../../../models/File");
const { handleAuthorization } = require("../../../../services/auth");
const { storageFolderPath } = require("../../../../constants");
const { downloadFromUrl } = require("starless-http/util");

const resizeImg = require("resize-img");

module.exports = brewExpressFuncCreateOrFindAll(
  File,
  {
    afterFunctionStart: handleAuthorization,
    beforeCreate: async (req) => {
      const userStorageFolder = path.join(
        storageFolderPath,
        req.body.createdby
      );

      if (!fs.existsSync(userStorageFolder)) {
        fs.mkdirSync(userStorageFolder);
      }
      const { file, name, resize } = req.body;
      req.body.location = path.join(userStorageFolder, name);

      if (file.startsWith("http")) {
        await downloadFromUrl(file, req.body.location);
      } else {
        fs.writeFileSync(
          req.body.location,
          Buffer.from(
            file.includes("base64,") ? file.split("base64,")[1] : file,
            "base64"
          )
        );
      }
      if (resize) {
        const image = await resizeImg(
          fs.readFileSync(req.body.location),
          resize
        );
        fs.writeFileSync(req.body.location, image);
      }

      delete req.body.file;
    },
    beforeQuery: (options, req) => {
      options["createdby"] = req.body.createdby;
    },
  },
  "mongoose"
);
