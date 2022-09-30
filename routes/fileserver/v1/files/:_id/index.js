const {
  brewExpressFuncFindOneOrUpdateOrDeleteByParam,
} = require("code-alchemy");
const path = require("path");
const fs = require("fs");
const File = require("../../../../../models/File");
const { handleAuthorization } = require("../../../../../services/auth");
const { storageFolderPath } = require("../../../../../constants");

module.exports = brewExpressFuncFindOneOrUpdateOrDeleteByParam(
  File,
  {
    afterFunctionStart: handleAuthorization,
    beforeUpdate: (data, req) => {
      const userStorageFolder = path.join(
        storageFolderPath,
        req.body.createdby
      );
      if (!fs.existsSync(userStorageFolder)) {
        fs.mkdirSync(userStorageFolder);
      }
      const { file, name } = req.body;
      req.body.location = path.join(userStorageFolder, name);
      if (req.body.location != data.location && fs.existsSync(data.location)) {
        fs.rmSync(data.location);
      }
      fs.writeFileSync(
        req.body.location,
        Buffer.from(
          file.includes("base64,") ? file.split("base64,")[1] : file,
          "base64"
        )
      );

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
