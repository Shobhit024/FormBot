const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Middleware
const checkAuth = require("../middleware/checkAuth"); // Corrected the path to checkAuth

// Import Routes
const userRoutes = require("./userRoutes"); // Adjust the path based on your folder structure
const botRoutes = require("./botRoutes"); // Adjust the path based on your folder structure
const folderRoutes = require("./folderRoutes"); // Adjust the path based on your folder structure

// Use Express JSON parser
app.use(express.json()); // Parse incoming JSON requests

// API Routes
app.use("/api/users", userRoutes); // Routes for user-related endpoints
app.use("/api/bots", checkAuth, botRoutes); // Routes for bot-related endpoints (with authentication middleware)
app.use("/api/folders", checkAuth, folderRoutes); // Routes for folder-related endpoints (with authentication middleware)

// Export app for use in server.js
module.exports = app;
