const {
  brewExpressFuncFindOneOrUpdateOrDeleteByParam,
} = require("code-alchemy");
const path = require("path");
const fs = require("fs");
const File = require("../../../../../models/File");
const { handleAuthorization } = require("../../../../../services/auth");
const { storageFolderPath } = require("../../../../../constants");
const { downloadFromUrl } = require("starless-http/util");

const resizeImg = require("resize-img");

module.exports = brewExpressFuncFindOneOrUpdateOrDeleteByParam(
  File,
  {
    afterFunctionStart: handleAuthorization,
    beforeQuery: (options, req) => {
      options["createdby"] = req.body.createdby;
    },
    beforeUpdate: async (data, req) => {
      const userStorageFolder = path.join(
        storageFolderPath,
        req.body.createdby
      );
      if (!fs.existsSync(userStorageFolder)) {
        fs.mkdirSync(userStorageFolder);
      }
      const { file, name, resize } = req.body;
      req.body.location = path.join(userStorageFolder, name);
      if (req.body.location != data.location && fs.existsSync(data.location)) {
        fs.rmSync(data.location);
      }
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
    beforeDelete: (data) => {
      if (fs.existsSync(data.location)) {
        fs.rmSync(data.location);
      }
    },
  },
  "Data not found!",
  "",
  "mongoose"
);
