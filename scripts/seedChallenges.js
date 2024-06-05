import mongoose from "mongoose";
import { Challenge } from "../models/challenge.js";
import { configDotenv } from "dotenv";

configDotenv();

// Array of challenge objects to be seeded into the database
const challenges = [
  {
    title: "Updated product card title",
    link: "some link",
    description: "Create a Product card",
    category: "CSS",
    difficulty: "Easy",
  },
  {
    title: "Responsive design challenge",
    link: "another link",
    description: "Build a responsive webpage",
    category: "CSS",
    difficulty: "Medium",
  },
  {
    title: "JavaScript quiz",
    link: "javascript quiz link",
    description: "Test your JavaScript knowledge",
    category: "JavaScript",
    difficulty: "Medium",
  },
  {
    title: "React component challenge",
    link: "react component link",
    description: "Create a reusable React component",
    category: "React",
    difficulty: "Hard",
  },
  {
    title: "HTML form validation",
    link: "html form validation link",
    description: "Implement client-side form validation using HTML",
    category: "HTML",
    difficulty: "Medium",
  },
  {
    title: "CSS animation task",
    link: "css animation link",
    description: "Create a CSS animation",
    category: "CSS",
    difficulty: "Medium",
  },
  {
    title: "Node.js API development",
    link: "node.js api link",
    description: "Build a RESTful API using Node.js",
    category: "Other",
    difficulty: "Hard",
  },
  {
    title: "Database design challenge",
    link: "database design link",
    description: "Design a database schema for a social media platform",
    category: "Other",
    difficulty: "Hard",
  },
  {
    title: "Responsive email template",
    link: "email template link",
    description: "Create a responsive email template",
    category: "Other",
    difficulty: "Medium",
  },
  {
    title: "CSS grid layout task",
    link: "css grid link",
    description: "Implement a complex CSS grid layout",
    category: "CSS",
    difficulty: "Hard",
  },
];

// Function to seed challenges into the database
const seedChallenges = async () => {
  try {
    // Delete existing challenges (optional)
    // await Challenge.deleteMany({});

    // Insert new challenges into the database
    await Challenge.insertMany(challenges);

    console.log("Challenges seeded successfully");
  } catch (error) {
    console.error("Error seeding challenges:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    // Seed challenges into the database
    seedChallenges();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
