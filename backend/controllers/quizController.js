const Question = require("../models/Question");
const Result = require("../models/Result");

// Get all questions (User use)
exports.getQuestions = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};
    const questions = await Question.find(filter);
    res.status(200).json(questions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch questions", error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Question.distinct("category");
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: err.message });
  }
};

// Admin: Add a single question
exports.addQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    res.status(201).json({ message: "Question added", data: newQuestion });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add question", error: err.message });
  }
};

// Admin: Delete a question
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: "Question deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete question", error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Question.countDocuments();

    const categoryStats = await Question.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({ total, categories: categoryStats });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: err.message });
  }
};

exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch results", error: err.message });
  }
};
