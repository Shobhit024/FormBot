const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const route = require("./routes/api"); // Adjust the path as necessary

dotenv.config(); // Load the .env file

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup: Allow all origins
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true, // Allow cookies to be sent with the request
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Successfully launched");
});
app.use("/api", route);

// MongoDB connection
const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/formbotDB"; // Use MONGODB_URI from .env
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};
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
