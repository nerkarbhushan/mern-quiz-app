const express = require("express");
const router = express.Router();
const { uploadQuestions } = require("../controllers/uploadController.js");
const upload = require("../middleware/uploadMiddleware.js");
const { protect, adminOnly } = require("../middleware/authMiddleware.js");

router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("file"),
  uploadQuestions
);

module.exports = router;
