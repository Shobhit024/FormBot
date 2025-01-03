const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
const route = require("../backend/routes/api");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// CORS setup
// Allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://form-bot-beta.vercel.app", // Deployed frontend (production)
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowedOrigins list or if no origin is sent (e.g., from Postman)
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Define allowed methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("successfully launch");
});
app.use("/api", route);

const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("mongoDB connected successfully");
  })
  .catch((err) => {
    console.log("err from mongoDB", err);
  });

app.listen(PORT, () => {
  console.log("app is running on port", PORT);
});
