const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Middleware
const checkAuth = require("../middleware/checkAuth");

// Import Routes
const userRoutes = require("./userRoutes");
const botRoutes = require("./botRoutes");
const folderRoutes = require("./folderRoutes");
// Use Express JSON parser
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/bots", checkAuth, botRoutes);
app.use("/api/folders", checkAuth, folderRoutes);
// Export app for use in server.js
module.exports = app;
