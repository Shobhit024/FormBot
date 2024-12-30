const botModel = require("../schema/botSchema"); // Corrected path
const botResponseModel = require("../schema/botResponseSchema"); // Corrected path

// Save Bot
exports.saveBot = async (req, res) => {
  try {
    const { folderId, botName, description } = req.body;
    const newBot = new botModel({
      whichFolder: folderId, // Reference to folder
      botName,
      description,
    });
    await newBot.save();
    res.status(201).json({ msg: "Bot saved successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get Bot Details
exports.botDetails = async (req, res) => {
  try {
    const { folderName, botName } = req.params;
    // Assuming folderName is the name, and you need to match ObjectId of the folder
    const folder = await FolderModel.findOne({ name: folderName });
    if (!folder) return res.status(404).json({ msg: "Folder not found" });

    const bot = await botModel.findOne({ whichFolder: folder._id, botName });
    if (!bot) return res.status(404).json({ msg: "Bot not found" });
    res.json(bot);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Save Bot Response
exports.botResponseSave = async (req, res) => {
  try {
    const { botId } = req.params;
    const { response } = req.body;
    const botResponse = new botResponseModel({ botId, response });
    await botResponse.save();
    res.status(201).json({ msg: "Response saved successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update Bot
exports.botUpdate = async (req, res) => {
  try {
    const { botId } = req.params;
    const { description } = req.body;
    const updatedBot = await botModel.findByIdAndUpdate(
      botId,
      { description },
      { new: true }
    );
    res.json(updatedBot);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
