const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({

  itemId: String,

  name: String,

  contact: String,

  studentId: String,

  department: String,

  reason: String,

  claimantProof: String,

  aiScore: {
    type: Number,
    default: 0,
  },

  aiRecommendation: {
    type: String,
    default: "Needs Verification",
  },

  aiReason: {
  type: String,
  default: "AI analysis not available.",
  },

  status: {
    type: String,
    default: "pending",
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model(
  "Claim",
  claimSchema
);