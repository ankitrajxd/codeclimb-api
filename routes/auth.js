import { Router } from "express";
import { User, validateUser } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import Joi from "joi";

configDotenv();

const router = Router();

router.post("/", async (req, res) => {
  const { error } = validateUserLogin(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  // check if the user  registered in db
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  // compare the hashed password
  const decoded = await bcrypt.compare(req.body.password, user.password);
  if (!decoded) {
    return res.status(400).send("Invalid email or password");
  }

  // generate a jwt token

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);

  // Set the token as a cookie
  res.cookie("token", token, {
    httpOnly: true, // Ensures the cookie is only accessible by the web server
    secure: true, // Ensures the cookie is only sent over HTTPS
    sameSite: "strict", // Ensures the cookie is sent only to your domain
    maxAge: 120000, // Cookie expiration time in milliseconds (1 hour)
  });

  return res.send("logged in");
});

function validateUserLogin(user) {
  const Schema = Joi.object({
    email: Joi.string().required().trim(),
    password: Joi.string().trim().required().min(8).max(255),
  });

  return Schema.validate(user);
}

export { router };
