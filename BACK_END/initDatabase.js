// Import required modules
const mongoose = require("mongoose");
const Plan = require("./Schemas/PlanSchema");
const User = require("./Schemas/UserSchema");
require("dotenv").config();

module.exports = async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo database connected");

    // Check if admin exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUser = await User.findOne({ email: adminEmail });

    let admin;
    if (!adminUser) {
      // Create a new admin user if not exists
      admin = new User({
        userName: process.env.ADMIN_USERNAME,
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });

      await admin.save();
      console.log("Admin user created:", admin);
    } else {
      admin = adminUser;
      console.log("Admin already exists:", admin);
    }

    // Check if any plan exists
    const planCount = await Plan.countDocuments();
    if (planCount === 0) {
      // Create initial Plan
      const firstPlan = new Plan({
        planName:"Admin initialize",
        id: 1, // Unique identifier for the plan
        usedLanguages: ["JavaScript", "Python"], // Example programming languages used
        localLocation: "Local Directory Path", // Example local path where code is stored
        githubLink: "https://github.com/example/repo", // Example GitHub repository link
        programNotes:
          "Initial plan to set up the development environment and create schemas.", // Notes for the plan
        tipsTricks: "Use Mongoose for MongoDB schema definitions.", // Tips and tricks related to the plan
        whatDone: "Set up MongoDB connection and initial admin user creation.", // Tasks already completed
        whatToDo: "Create and test initial Plan schema.", // Tasks yet to do
        author: admin._id, // Reference to the admin user who created this plan
        isDeleted: false, // Soft delete flag
      });

      await firstPlan.save();
      console.log("Initial plan created:", firstPlan);
    } else {
      console.log("Plans already exist in the database.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
