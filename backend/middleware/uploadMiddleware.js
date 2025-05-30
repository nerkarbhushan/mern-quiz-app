const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `quiz-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("spreadsheetml") ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only Excel files allowed."));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
