const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  correct_answer: String,
  incorrect_answers: [String],
  category: String,
  difficulty: String
});

module.exports = mongoose.model("Question", questionSchema);
