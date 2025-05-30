const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./configDB/connectDB.js");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes.js");
const quizRoutes = require("./routes/quizRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
const resultRoutes = require("./routes/resultRoutes.js");

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;
connectDB(MONGODB_URL);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/admin", uploadRoutes);
app.use("/api/results", resultRoutes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => app.listen(process.env.PORT))
  .then(() =>
    console.log(`Connected to mongoDB and listen to PORT ${process.env.PORT}`)
  )
  .catch((error) => console.log(error));
