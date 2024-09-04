const mongoose = require("mongoose");

// Create schema
const PlanSchema = new mongoose.Schema({

  planName:{
    type:String,
    required:true,
    trim:true,
    unique:true
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  id: {
    type: Number,
    required: true,
  },
  usedLanguages: {
    type: [String],
    required: true,
    default: [],
  },
  localLocation: {
    type: String,
  },
  githubLink: {
    type: String,
  },
  programNotes: {
    type: String,
    required: false,
  },
  tipsTricks: {
    type: String,
    required: false,
  },
  whatDone: {
    type: String,
  },
  whatToDo: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Middleware to update updatedAt before saving
PlanSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create model
const Plan = mongoose.model("Plan", PlanSchema);

module.exports = Plan;
