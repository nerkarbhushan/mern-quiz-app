const parseExcel = require("../utils/parseExcel");
const Question = require("../models/Question");
const fs = require("fs");

// Admin: Upload Excel file and insert questions
exports.uploadQuestions = async (req, res) => {
  try {
    const filePath = req.file.path;
    const questions = parseExcel(filePath);

    // Save to DB
    await Question.insertMany(questions);

    // Delete file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Questions uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload questions" });
  }
};
