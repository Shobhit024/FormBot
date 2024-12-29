const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const route = require("./routes/api"); // Adjust this path if necessary

dotenv.config(); // Load environment variables from .env file

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: "*", // Allow all origins for simplicity (adjust for production)
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Server successfully launched");
});
app.use("/api", route);

// MongoDB connection
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Call the database connection function
connectDB();

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
