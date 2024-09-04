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

router.get("/showallplans", async function (req, res, next) {
  const keys = await getKeys();
  console.log("these are keys", keys);
  console.log("active user is ", req.user.username);

  res.render("showallplans", {
    title: "Show All Plans",
    keys: keys,
    user: req.user || guestUser,
  });
});

//show all program plans it returns json not render page
router.get("/allplans", async function (req, res) {
  try {
    const plans = await Plan.find();
    console.log(plans);
    res.status(200).json({
      success: true,
      user: req.user,
      plans: plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal service error",
    });
  }
});

//empty page for further development
router.get("/addplan", (req, res, next) => {
  res.render("newpage", {
    title: "add new",
    user: req.user,
  });
});

// POST new program plan
router.post("/addplan", async function (req, res, next) {
  try {
    // Generate the next id (assuming auto-increment logic)
    const maxPlan = await Plan.findOne().sort({ id: -1 });
    const nextId = maxPlan ? maxPlan.id + 1 : 1;

    const newPlan = new Plan({
      id: nextId, // Automatically generated ID
      planName: req.body.planName,
      usedLanguages: req.body.usedLanguages
        ? req.body.usedLanguages.split(",").map((lang) => lang.trim())
        : [],
      localLocation: req.body.localLocation,
      githubLink: req.body.githubLink,
      programNotes: req.body.programNotes,
      tipsTricks: req.body.tipsTricks,
      whatDone: req.body.whatDone,
      whatToDo: req.body.whatToDo,
      author: req.body.author || "66ce54c9c4db286e3929925c",
      isDeleted: false,
    });

    await newPlan.save();

    res.status(201).json({
      success: true,
      message: "New plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error creating new plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT update an existing program plan
router.put("/updateplan/:id", async function (req, res, next) {
  try {
    // Extract plan id from URL parameters
    const planId = req.params.id;

    // Check if a plan with the specified 'id' exists
    const existingPlan = await Plan.findOne({ id: planId });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: `The Plan with id: ${planId} does not exist`,
      });
    }

    // Convert 'author' field to ObjectId if provided in the request body
    let authorObjectId;
    if (req.body.author) {
      authorObjectId = new mongoose.Types.ObjectId(req.body.author);
    }

    // Update the plan with the data from the request body
    existingPlan.planName = req.body.planName || existingPlan.planName;
    existingPlan.usedLanguages =
      req.body.usedLanguages || existingPlan.usedLanguages;
    existingPlan.localLocation =
      req.body.localLocation || existingPlan.localLocation;
    existingPlan.githubLink = req.body.githubLink || existingPlan.githubLink;
    existingPlan.programNotes =
      req.body.programNotes || existingPlan.programNotes;
    existingPlan.tipsTricks = req.body.tipsTricks || existingPlan.tipsTricks;
    existingPlan.whatDone = req.body.whatDone || existingPlan.whatDone;
    existingPlan.whatToDo = req.body.whatToDo || existingPlan.whatToDo;
    existingPlan.author = authorObjectId || existingPlan.author;
    existingPlan.isDeleted =
      req.body.isDeleted !== undefined
        ? req.body.isDeleted
        : existingPlan.isDeleted;

    // Update the 'updatedAt' field to the current date
    existingPlan.updatedAt = Date.now();

    // Save the updated plan to the database
    await existingPlan.save();

    // Respond with the updated plan
    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      plan: existingPlan,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE a program plan
router.delete("/deleteplan/:id", async function (req, res, next) {
  try {
    // Extract plan id from URL parameters
    const planId = req.params.id;

    // Check if the plan id is '1' and prevent deletion
    if (planId === "1") {
      return res.status(403).json({
        success: false,
        message: "Deletion of the initial plan is not allowed.",
      });
    }

    // Check if a plan with the specified 'id' exists
    const existingPlan = await Plan.findOne({ id: planId });

    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: `The Plan with id: ${planId} does not exist`,
      });
    }

    // Proceed to delete the plan if it is not the initial plan
    await Plan.deleteOne({ id: planId });

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: `Plan with id: ${planId} has been successfully deleted`,
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
