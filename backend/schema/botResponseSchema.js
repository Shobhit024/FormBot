const mongoose = require("mongoose");

const botResponseSchema = new mongoose.Schema(
  {
    botResponseArr: [
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
          required: [true, "Value is required"],
        },
      },
    ],
    whichBot: {
      type: mongoose.Schema.ObjectId,
      ref: "bot", // Matches the `bot` model name
      required: [true, "Bot reference is required"],
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const botResponseModel = mongoose.model("botResponse", botResponseSchema);
module.exports = botResponseModel;
