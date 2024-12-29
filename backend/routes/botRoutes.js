const express = require("express");
const router = express.Router();
const {
  saveBot,
  botDetails,
  botResponseSave,
  botUpdate,
} = require("../controllers/botController");

// Bot Routes
router.post("/save_bot", saveBot);
router.get("/bot_details/:folderName/:botName", botDetails);
router.post("/bot_response_save/:botId", botResponseSave);
router.patch("/bot_update/:botId", botUpdate);

module.exports = router;
