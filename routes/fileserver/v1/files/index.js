const { brewExpressFuncCreateOrFindAll } = require("code-alchemy");
const path = require("path");
const fs = require("fs");
const File = require("../../../../models/File");
const { handleAuthorization } = require("../../../../services/auth");
const { storageFolderPath } = require("../../../../constants");

module.exports = brewExpressFuncCreateOrFindAll(
  File,
  {
    afterFunctionStart: handleAuthorization,
    beforeCreate: (req) => {
      const userStorageFolder = path.join(
        storageFolderPath,
        req.body.createdby
      );

      if (!fs.existsSync(userStorageFolder)) {
        fs.mkdirSync(userStorageFolder);
      }
      const { file, name } = req.body;
      req.body.location = path.join(userStorageFolder, name);
      fs.writeFileSync(
        req.body.location,
        Buffer.from(
          file.includes("base64,") ? file.split("base64,")[1] : file,
          "base64"
        )
      );
      delete req.body.file;
    },
    beforeQuery: (options, req) => {
      options["createdby"] = req.body.createdby;
    },
  },
  "mongoose"
);
