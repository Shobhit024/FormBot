const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    folders: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "folder", // Matches the `folder` model name from the folder schema
      },
    ],
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
