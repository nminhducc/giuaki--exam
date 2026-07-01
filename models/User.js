const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "userName "],
  },
  email: {
    type: String,
    required: [true, "email "],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password "

    ],
  },
  apiKey: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
