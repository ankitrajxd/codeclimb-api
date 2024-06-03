import { Router } from "express";
import { User, validateUser } from "../models/user.js";
import bcrypt from "bcrypt";
import { admin, auth } from "../middleware/auth.js";
import Joi from "joi";

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

export { router };
