const mongoose = require("mongoose");

const botSchema = new mongoose.Schema(
  {
    botName: {
      type: String,
      required: [true, "Bot name is required"],
      trim: true,
    },
    theme: {
      type: String,
      required: [true, "Theme is required"],
      trim: true,
    },
    botArr: [
      {
        responseType: {
          type: String,
          required: [true, "Response type is required"],
        },
        category: {
          type: String,
          required: [true, "Category is required"],
        },
        value: {
          type: String,
          default: "",
        },
      },
    ],
    whichFolder: {
      type: mongoose.Schema.ObjectId,
      ref: "folder",
      required: [true, "Folder reference is required"],
    },
    botResponse: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "botResponse",
      },
    ],
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const botModel = mongoose.model("bot", botSchema);
module.exports = botModel;
