const { Schema, model, models } = require("mongoose");

module.exports = (modelName, schemaDef, schemaOptions = {}, indexes = []) => {
  if (models[modelName]) {
    return models[modelName];
  }
  const schema = new Schema(
    {
      deletedAt: {
        type: Date,
        default: null,
      },
      createdby: {
        type: String,
        default: "",
      },
      ...schemaDef,
    },
    {
      timestamps: true,
      ...schemaOptions,
    }
  );
  schema.index({ "$**": "text" });
  for (const { fields, options } of indexes) {
    schema.index(fields, options || {});
  }
  return model(modelName, schema);
};
