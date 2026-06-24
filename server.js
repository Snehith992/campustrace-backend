const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({
  path: "./models/cloud.env",
});

const app = express();

const claimRoutes = require("./routes/claimRoutes");
const itemRoutes = require("./routes/itemRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/claims", claimRoutes);
app.use("/api/items", itemRoutes);

// MongoDB Atlas Connection
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});