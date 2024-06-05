import { Router } from "express";
import { Challenge, validateChallenge } from "../models/challenge.js";
import Joi from "joi";
import { admin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let query = {};

    if (req.query.difficulty) {
      const difficulty = req.query.difficulty.toLowerCase();

      query.difficulty = { $regex: new RegExp("^" + difficulty, "i") };
    }

    const challenges = await Challenge.find(query);
    res.send(challenges);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching challenges" });
  }
});

//-----------------------------------------------
// Ensure the text index is created

async function createIndex() {
  try {
    await Challenge.createIndexes();
  } catch (error) {
    console.log("Index not created!");
  }
}

createIndex();

// Search endpoint
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  try {
    // Use MongoDB's text search
    const results = await Challenge.find({ $text: { $search: query } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while searching" });
  }
});
//-----------------------------------------------------

router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    return res.send(challenge);
  } catch (error) {
    return res.status(400).send("Challenge not found");
  }
});

router.post("/", admin, async (req, res) => {
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

router.delete("/:id", admin, async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
  } catch (error) {
    return res.status(400).send("Challenge not found with the given id.");
  }
  res.send("Deleted Successfully.");
});

router.put("/:id", admin, async (req, res) => {
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
