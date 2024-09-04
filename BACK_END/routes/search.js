var express = require("express");

var router = express.Router();
var mongoose = require("mongoose");
var Plan = require("../Schemas/PlanSchema");
var User = require("../Schemas/UserSchema");
const verifyToken = require("../middlewares/jwtmiddleware");

const { authenticate, authorize } = require("../middlewares/jwtmiddleware");

router.use(authenticate);

const guestUser = {
  name: "guest",
  username: "guest ",
};

//find keys in database
async function getKeys() {
  try {
    const documents = await Plan.find();
    const keys = Object.keys(documents[0].toObject());

    return keys;
  } catch (error) {
    console.log(error);
  }
}

//Query search ADD SEARCH BAR

router.post("/search", async (req, res, next) => {
  try {
    const { query } = req.body; // Extract query object from the body

    // Check if the query is provided and not empty
    if (!query || Object.keys(query).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query object is empty.",
      });
    }

    // Initialize an array to hold all query conditions
    let allQueries = [];

    // Fetch all fields available in the Plan schema dynamically
    const databaseKeys = await getKeys();

    // List of fields that should be excluded from general regex search
    const excludeFieldsForRegex = [
      "_id",
      "id",
      "author",
      "createdAt",
      "updatedAt",
      "isDeleted",
      "__v",
    ];

    // Determine if the search is general or specific field-based
    if (typeof query === "string") {
      // General search across all fields (except excluded ones)
      const queryStrings = query
        .split(" ")
        .filter((term) => term.trim() !== "");

      // Create a regex search for each term in each field, case insensitive
      queryStrings.forEach((element) => {
        const regex = new RegExp(element, "i"); // Regex pattern for searching content
        databaseKeys.forEach((field) => {
          if (!excludeFieldsForRegex.includes(field)) {
            if (field === "usedLanguages") {
              // If the field is an array, check if any element in the array matches
              allQueries.push({ [field]: { $elemMatch: { $regex: regex } } });
            } else {
              // For string fields, apply regex directly
              allQueries.push({ [field]: regex });
            }
          }
        });
      });
    } else {
      // Specific field-based search
      for (const [field, value] of Object.entries(query)) {
        if (databaseKeys.includes(field)) {
          if (field === "author") {
            // If searching by author, we need an exact match on ObjectId
            const user = await User.findOne({ userName: value }); // Find user by userName
            if (user) {
              allQueries.push({ [field]: user._id }); // Use the user's ObjectId
            } else {
              return res.status(404).json({
                success: false,
                message: `No user found with username: ${value}`,
              });
            }
          } else if (Array.isArray(value)) {
            // Handle searches for array fields (like usedLanguages)
            allQueries.push({
              [field]: { $all: value.map((v) => new RegExp(v, "i")) },
            });
          } else if (excludeFieldsForRegex.includes(field)) {
            // For non-string fields, do a direct match
            allQueries.push({ [field]: value });
          } else {
            // For other fields, use regex for a case-insensitive match
            allQueries.push({ [field]: new RegExp(value, "i") });
          }
        }
      }
    }

    console.log("Generated Queries:", allQueries); // Debugging log

    // Perform the search query on the Plan collection
    const allPlans = await Plan.find({ $or: allQueries });

    console.log("Search Results:", allPlans); // Debugging log

    // Check if any plans were found
    if (!allPlans || allPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks were found.",
      });
    }

    // Prepare the response data
    const planCount = allPlans.length;
    console.log("Number of documents found:", planCount);

    const listViewData = allPlans.map((plan) => plan.id);
    const showQueries = JSON.stringify(req.body.query);

    res.status(200).json({
      success: true,
      message: `Query ${showQueries} found in ${planCount} documents`,
      data: listViewData, // or allPlans
    });
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

module.exports = router;
