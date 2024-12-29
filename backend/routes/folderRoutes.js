const express = require("express");
const router = express.Router();
const {
  createFolder,
  getFolderDetails,
  deleteFolder,
} = require("../controllers/folderController");

// Folder Routes
router.post("/create_folder", createFolder);
router.get("/get_folder_details", getFolderDetails);
router.delete("/delete_folder/:folderId", deleteFolder);

module.exports = router;
