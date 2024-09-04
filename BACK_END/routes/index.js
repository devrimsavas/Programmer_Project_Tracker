var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var Plan = require("../Schemas/PlanSchema");
var User = require("../Schemas/UserSchema");

//const { authenticate } = require("../middlewares/jwtmiddleware");
const { checkUser } = require("../middlewares/jwtmiddleware");

//github test

router.use(checkUser);

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

//set universal guest user

const guestUser = {
  name: "guest",
  username: "guest ",
};

//router to get keys
router.get("/key", async (req, res, next) => {
  try {
    const databaseKeys = await getKeys();
    res.status(200).json({
      success: true,
      keys: databaseKeys,
    });
  } catch (error) {
    console.error("error", error);
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("user in plans page", JSON.stringify(req.user));
  console.log(req.user);
  res.render("plans", {
    title: "Programmer Planner",
    user: req.user,
  });
});

module.exports = router;
