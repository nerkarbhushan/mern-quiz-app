// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: [(arr) => arr.length >= 2, "At least two options are required"],
    },
    correctAnswer: { type: String, required: true },
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
