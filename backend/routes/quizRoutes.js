const express = require("express");
const router = express.Router();
const {
  getQuestions,
  addQuestion,
  deleteQuestion,
  getStats,
  getCategories,
  getUserResults,
} = require("../controllers/quizController.js");
const { protect, adminOnly } = require("../middleware/authMiddleware.js");

router.get("/", protect, getQuestions);
router.post("/", protect, adminOnly, addQuestion);
router.delete("/:id", protect, adminOnly, deleteQuestion);
router.get("/stats", protect, adminOnly, getStats);
router.get("/categories", getCategories);
router.get("/scorecard", protect, getUserResults);

module.exports = router;
