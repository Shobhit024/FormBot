const folderModel = require("../schema/folderSchema");

// Create Folder
exports.createFolder = async (req, res) => {
  try {
    const { folderName, description } = req.body;
    const newFolder = new folderModel({ folderName, description });
    await newFolder.save();
    res.status(201).json({ msg: "Folder created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Folder Details
exports.getFolderDetails = async (req, res) => {
  try {
    const folders = await folderModel.find();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Folder
exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    await folderModel.findByIdAndDelete(folderId);
    res.json({ msg: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
