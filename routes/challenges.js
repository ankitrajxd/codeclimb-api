import { Router } from "express";
import { Challenge, validateChallenge } from "../models/challenge.js";
import Joi from "joi";

const router = Router();

router.get("/", async (req, res) => {
  const challenges = await Challenge.find();
  res.send(challenges);
});

router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    return res.send(challenge);
  } catch (error) {
    return res.status(400).send("Challenge not found");
  }
});

router.post("/", async (req, res) => {
  const { error } = validateChallenge(req.body);

  if (error) return res.status(400).send(error.message);

  const challenge = new Challenge({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    difficulty: req.body.difficulty,
    image: req.body.image,
    link: req.body.link,
  });

  await challenge.save();

  res.send(challenge);
});

router.delete("/:id", async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
  } catch (error) {
    return res.status(400).send("Challenge not found with the given id.");
  }
  res.send("Deleted Successfully.");
});

router.put("/:id", async (req, res) => {
  const { error } = validateEditChallenge();

  if (error) return res.status(400).send(error.message);

  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.send(updatedChallenge);
  } catch (error) {
    return res.status(400).send("Invalid Id");
  }
});

function validateEditChallenge(challenge) {
  const Schema = Joi.object({
    title: Joi.string().min(3).max(30).trim(),
    link: Joi.string().trim(),
    image: Joi.string().trim(),
    description: Joi.string().min(0),
    category: Joi.string().valid("HTML", "CSS", "JavaScript", "React", "Other"),
    difficulty: Joi.string().valid("Easy", "Medium", "Hard"),
  });

  return Schema.validate(challenge);
}

export { router };
