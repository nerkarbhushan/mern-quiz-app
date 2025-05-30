// controllers/resultController.js
const Result = require("../models/Result");
const User = require("../models/User");

exports.saveResult = async (req, res) => {
  const { score, total, category } = req.body;
  try {
    const result = new Result({
      userId: req.user._id,
      name: req.user.name,
      score,
      total,
      category,
    });
    console.log("Saving result for:", req.user.username, req.user._id);
    await result.save();
    res.status(200).json({ message: "Result saved" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save result", error: err.message });
  }
};

// controllers/resultController.js
exports.getUserResults = async (req, res) => {
  try {
    const userId = req.user.id; // assuming verifyUser middleware sets req.user
    const results = await Result.find({ user: userId });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
};

// Get all user results (admin only)
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ date: -1 });

    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch results", error: err.message });
  }
};

//delete the record
exports.deleteRecord = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted" });
  } catch (err) {
    res.status(500).json({ error: "Deletion failed" });
  }
};
