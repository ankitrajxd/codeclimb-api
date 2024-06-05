import express from "express";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import { router as challenges } from "./routes/challenges.js";
import { router as users } from "./routes/users.js";
import { router as auth } from "./routes/auth.js";
import cookieParser from "cookie-parser";

configDotenv();

if (!process.env.JWT_SECRET_KEY) {
  console.log("FATAL ERROR, JWT SECRET KEY NOT PROVIDED!");
  process.exit(1);
}
if (!process.env.MONGO_URL) {
  console.log("FATAL ERROR, DATABASE URL NOT PROVIDED!");
  process.exit(1);
}
if (!process.env.GOOGLE_APP_PASSWORD) {
  console.log(
    "FATAL ERROR, Google app password not provided. Mailing feature will not work!"
  );
  process.exit(1);
}

// Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
  })
  .then(() => console.log("Database Connected..."))
  .catch((err) => console.log("Database not connected!"));

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
