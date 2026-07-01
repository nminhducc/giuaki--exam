const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "userName là bắt buộc"],
  },
  email: {
    type: String,
    required: [true, "email là bắt buộc"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password là bắt buộc"],
  },
  apiKey: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
