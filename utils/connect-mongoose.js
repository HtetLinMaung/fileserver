const mongoose = require("mongoose");

module.exports = async () => mongoose.connect(process.env.db_url);
