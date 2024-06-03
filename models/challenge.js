import mongoose from "mongoose";
import Joi from "joi";

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    min: 0,
  },
  category: {
    type: String,
    enum: ["HTML", "CSS", "JavaScript", "React", "Other"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
});

// Create a text index on the title, description, and category fields
challengeSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

const Challenge = mongoose.model("Challenge", challengeSchema);

function validateChallenge(challenge) {
  const Schema = Joi.object({
    title: Joi.string().required().min(3).max(30).trim(),
    link: Joi.string().required().trim(),
    image: Joi.string().trim(),
    description: Joi.string().min(0),
    category: Joi.string()
      .valid("HTML", "CSS", "JavaScript", "React", "Other")
      .required(),
    difficulty: Joi.string().valid("Easy", "Medium", "Hard").required(),
  });

  return Schema.validate(challenge);
}

export { Challenge, validateChallenge };
