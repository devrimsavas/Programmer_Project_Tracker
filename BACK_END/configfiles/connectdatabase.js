const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to Database");
  } catch (error) {
    console.error(`error ${error.message}`);
  }
};

module.exports = connectDB;
