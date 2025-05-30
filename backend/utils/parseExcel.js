// utils/parseExcel.js
const xlsx = require("xlsx");

const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const formatted = rows.map((row) => ({
    questionText: row.questionText,
    options: [row.option_A, row.option_B, row.option_C, row.option_D],
    correctAnswer: row.correctAnswer,
    category: row.category || "general",
  }));

  return formatted;
};

module.exports = parseExcel;
