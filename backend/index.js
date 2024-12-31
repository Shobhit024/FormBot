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
app.use(cookieParser());
// CORS setup
// app.use(
//   cors({
//     origin: "https://formbot-gamo.onrender.com",
//     credentials: true,
//   })
// );
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // Update this to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // This allows cookies and other credentials to be sent
  })
);

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
