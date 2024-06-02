import mongoose from "mongoose";
import Joi from "joi";

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
  },
  solvedChallenges: [{ type: Schema.Types.ObjectId, ref: "Challenge" }],
  role: {
    type: String,
    enum: ["admin", "user"],
  },
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const Schema = Joi.object({
    name: Joi.string().required().min(3).max(30).trim(),
    email: Joi.string().required().trim(),
    password: Joi.string().trim().required().min(8).max(255),
    solvedChallenges: Joi.array().items(Joi.string()),
    role: Joi.string(),
  });

  return Schema.validate(user);
}

export { User, validateUser };
