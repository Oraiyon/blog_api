const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  admin: { type: Boolean, required: true }
});

module.exports = mongoose.model("users", UserSchema);
