import express from "express";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import { router as challenges } from "./routes/challenges.js";
import { router as users } from "./routes/users.js";
import { router as auth } from "./routes/auth.js";
import cookieParser from "cookie-parser";

configDotenv();

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected..."))
  .catch((err) => console.log("Db not connected!"));

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/challenges", challenges);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.send("Hello world");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
