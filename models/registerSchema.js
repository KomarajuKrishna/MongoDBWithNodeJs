const mongoose = require("mongoose");

const registerUserSchema = mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  gender: { type: String },
});

module.exports = mongoose.model("Users", registerUserSchema);
