// auth routes

var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var User = require("../Schemas/UserSchema");
var Plan = require("../Schemas/PlanSchema");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

//GET LOGIN PAGE

router.get("/login", (req, res, next) => {
  console.log("login page user", req.user);
  res.render("login", {
    title: "Login",
    user: req.user,
  });
});

//POST LOGIN

router.post("/", async function (req, res, next) {
  // get user name and password from body
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: "Please Provide username and password",
    });
  }

  try {
    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found ",
      });
    }
    //console user

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }
    //user matched and create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }; //end of payload

    //sign jwt
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;

        res.cookie("token", token, { httpOnly: true, secure: true });

        res.status(200).json({
          statusCode: 200,
          token: token,
          user: user,
          message: `Login successful for ${user.userName}`,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

//LOGOUT

router.get("/logout", (req, res, next) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
