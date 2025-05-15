const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  history: [
    {
      score: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
