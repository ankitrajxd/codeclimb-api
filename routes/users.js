import { Router } from "express";
import { User, validateUser } from "../models/user.js";
import bcrypt from "bcrypt";
import { admin, auth } from "../middleware/auth.js";
import Joi from "joi";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const router = Router();

router.get("/", admin, async (req, res) => {
  const users = await User.find().select("name email solvedChallenges");
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user).select(
    "_id name email role solvedChallenges"
  );

  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  // check if the user already registered in db
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already registered");
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    solvedChallenges: req.body.solvedChallenges,
  });

  await user.save();

  return res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    solvedChallenges: user.solvedChallenges,
  });
});

//=========================================
// updating the challenges for the users
router.put("/:id", auth, async (req, res) => {
  const { error } = validatePutRequest(req.body);
  if (error) {
    return res.status(500).send(error.message);
  }

  const user = await User.findById(req.params.id);

  try {
    let updatedSolvedChallenges = [
      ...req.body.solvedChallenges,
      ...user.solvedChallenges,
    ];

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { solvedChallenges: updatedSolvedChallenges },
      {
        new: true,
      }
    );

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      solvedChallenges: updatedUser.solvedChallenges,
    });
  } catch (error) {
    res.status(400).send("Not a valid id");
  }
});

function validatePutRequest(user) {
  const Schema = Joi.object({
    solvedChallenges: Joi.array().items(Joi.string()),
  });

  return Schema.validate(user);
}

//============================================
// forget password

router.post("/forget-password", async (req, res) => {
  const { error } = validateForgetPasswordReq(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Account not found!");
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 60,
  });

  // add the resetpassword token field on user obj so that it can be verified later.
  await User.findByIdAndUpdate(
    user._id,
    {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    },
    { new: true }
  );

  // sending email with reset link
  // Configure your email service
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.GMAIL_ADDRESS,
    subject: "CodeClimb Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://${req.headers.host}/api/users/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  await transporter.sendMail(mailOptions);
  res.status(200).send("Password reset email sent");
});

//--------------------------------------------
// function to validate email.
function validateForgetPasswordReq(email) {
  const Schema = Joi.object({
    email: Joi.string().required().trim(),
  });

  return Schema.validate(email);
}
//==========================================
// user will send new password with the generated token

router.post("/reset-password/:token", async (req, res) => {
  try {
    jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return res.status(400).send("Link Expired");
  }

  const user = await User.findOne({
    _id: decoded._id,
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Invalid token");
  }

  // check whether new password is similar to old one
  const checkPassword = await bcrypt.compare(req.body.password, user.password);
  if (checkPassword) {
    return res
      .status(400)
      .send("Your new password can not be same as the previous one.");
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // update the password field.
  await User.findByIdAndUpdate(
    user._id,
    {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
    { new: true }
  );

  res.send("Password reset successfully!");
});

export { router };
