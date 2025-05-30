const mongoose = require("mongoose");

const connectDB = async (MONGODB_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "quiz_app",
    };
    await mongoose.connect(MONGODB_URL, DB_OPTIONS);
    console.log("connected Successfully!!");
  } catch (error) {
    console.error(error);
  }
};
module.exports = connectDB;
