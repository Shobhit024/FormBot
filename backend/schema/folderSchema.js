const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    folderName: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
    },
    whichUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "A folder must belong to a user"],
    },
    allBots: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "bot",
      },
    ],
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const folderModel = mongoose.model("folder", folderSchema);
module.exports = folderModel;
