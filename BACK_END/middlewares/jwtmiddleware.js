const jwt = require("jsonwebtoken");
const jsend = require("jsend");

//import user and program schema
const User = require("../Schemas/UserSchema");
const Plan = require("../Schemas/PlanSchema");

//check user because we can set it as guest if user did not log in

const checkUser = (req, res, next) => {
  const token = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer", "")
    : req.cookies.token;

  if (token) {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified.user; //set user if token is valid
    } catch (error) {
      console.error("Token verification error", error);
      req.user = { username: "Guest", role: "guest" }; //no token so i set user as guest
    }
  } else {
    req.user = { username: "Guest", role: "guest" };
  }
  next();
}; //end check user

//create token middleware

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer ", "")
    : req.cookies.token;
  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Access denied. You need to login to access this resource",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    //req.user = verified;
    req.user = verified.user;
    next();
  } catch (error) {
    console.error("token verification error", error);
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

//user roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        statusCode: 403,
        message: "This user is not authorized to access this resource",
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize, checkUser };
