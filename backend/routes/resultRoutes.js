const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware.js");
const {
  getUserResults,
  saveResult,
  getAllResults,
  deleteRecord,
} = require("../controllers/resultController.js");

router.get("/", protect, getUserResults);
router.post("/", protect, saveResult);
router.get("/all", protect, adminOnly, getAllResults);
router.delete("/:id", protect, adminOnly, deleteRecord);

module.exports = router;
