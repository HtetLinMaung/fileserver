const createModel = require("../utils/create-model");

module.exports = createModel("File", {
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  private: {
    type: Boolean,
    default: false,
  },
  createdby: {
    type: String,
    required: true,
  },
});
