const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

  title: String,

  category: {
    type: String,
    default: "Others",
  },

  description: String,

  location: String,

  image: String,

  secretMark: String,

  reportedBy: String,

  reporterEmail: String,

  reporterPhoto: String,

  isClaimed: {
    type: Boolean,
    default: false,
  },

  reportedAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("Item", itemSchema);