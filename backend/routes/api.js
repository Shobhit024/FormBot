const express = require("express");
const route = express.Router();
const userModel = require("../schema/userSchema");
const folderModel = require("../schema/folderSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const botModel = require("../schema/botSchema");
const botResponseModel = require("../schema/botResponseSchema");

// Register API
route.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(
    "name, email, password, confirmPassword: ",
    name,
    email,
    password,
    confirmPassword
  );
  const findExistUser = await userModel.findOne({ email });
  if (!name || !email || !password || !confirmPassword)
    return res.status(400).json({ msg: "All fields are required" });
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Passwords must be same" });
  if (findExistUser)
    return res.status(409).json({ msg: "This email is already exist" });

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    await new userModel({ name, email, password: hashPassword }).save();
    console.log("New user created");
    return res.status(201).json({ msg: "New user created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Login API
route.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findExistUser = await userModel.findOne({ email });
  if (!findExistUser) return res.status(400).json({ msg: "User not found" });
  try {
    const isMatch = await bcrypt.compare(password, findExistUser.password);
    if (isMatch) {
      const findFirstFolder = await folderModel.find({
        folderName: "main",
        whichUser: findExistUser._id,
      });
      const tokenId = jwt.sign(
        { user: findExistUser },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      if (findFirstFolder.length == 0) {
        try {
          const newFolder = await new folderModel({
            folderName: "main",
            whichUser: findExistUser._id,
          }).save();
          console.log("newFolder: ", newFolder);
          findExistUser.folders.push(newFolder._id);
          await findExistUser.save();
          console.log("User updated with new folder ID");
        } catch (error) {
          console.error("Error creating new folder or updating user:", error);
        }
      }
      return res.status(200).json({ msg: "Sign in successfully", tokenId });
    } else {
      return res.status(400).json({ msg: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Logout API
route.post("/logout", checkAuth, (req, res) => {
  try {
    if (req.loginUser) {
      console.log("logout successfully");
      return res.status(200).json({ msg: "Logout Successfully" });
    }
    return res.status(200).json({ msg: "something wrong" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//create folder API
route.post("/create_folder", checkAuth, async (req, res) => {
  const findUserAllFolders = await folderModel.find({
    whichUser: req.loginUser._id,
  });
  const findLoginUser = await userModel.findOne({ _id: req.loginUser._id });
  console.log(findLoginUser);
  console.log(req.body.folderName);
  try {
    const isFolderNameExist = await folderModel.findOne({
      whichUser: req.loginUser._id,
      folderName: req.body.folderName,
    });
    if (isFolderNameExist)
      return res.status(409).json({ msg: "folder name already exist" });
    if (req.body.folderName !== "") {
      const newFolder = await new folderModel({
        folderName: req.body.folderName,
        whichUser: findLoginUser._id,
      }).save();
      findLoginUser.folders.push(newFolder._id);
      await findLoginUser.save();
    }
    return res.status(200).json({ allFolder: findUserAllFolders });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//get all folder API
route.get("/get_folder_details", checkAuth, async (req, res) => {
  try {
    const findUserFolders = await folderModel
      .find({ whichUser: req.loginUser._id })
      .populate("allBots");
    return res
      .status(200)
      .json({ allFolder: findUserFolders, user: req.loginUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//get bot details by folder and bot name API
route.get("/bot_details/:folderName/:botName", checkAuth, async (req, res) => {
  const { folderName, botName } = req.params;
  try {
    const findUserFolder = await folderModel
      .findOne({ whichUser: req.loginUser._id, folderName })
      .populate("allBots");
    if (!findUserFolder)
      return res.status(404).json({ msg: "Folder not found" });
    const findBot = findUserFolder.allBots.find(
      (bot) => bot.botName === botName
    );
    if (!findBot) return res.status(404).json({ msg: "bot not found" });
    return res.status(200).json(findBot);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//get bot details by botId- API
route.get("/bot_form_details/:botId", async (req, res) => {
  try {
    const findBot = await botModel.findById(req.params.botId);
    if (!findBot) return res.status(404).json({ msg: "bot not found" });
    return res.status(200).json(findBot);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//delete folder and after it would delete from user model also API
route.delete("/delete_folder/:folderId", checkAuth, async (req, res) => {
  try {
    const deleteFolder = await folderModel.findOneAndDelete({
      _id: req.params.folderId,
    });
    if (!deleteFolder) return res.status(404).json({ msg: "Folder not found" });
    await botModel.deleteMany({ whichFolder: req.params.folderId });
    const findLoginUser = await userModel.findOne({ _id: req.loginUser._id });
    findLoginUser.folders = findLoginUser.folders.filter(
      (folder) => folder.toString() !== req.params.folderId
    );
    await findLoginUser.save();
    return res.status(200).json({ msg: "folder delete successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//save bot API
route.post("/save_bot", checkAuth, async (req, res) => {
  const { data, folder } = req.body;
  try {
    const findFolder = await folderModel.findOne({
      whichUser: req.loginUser._id,
      folderName: folder,
    });
    if (!findFolder) return res.status(404).json({ msg: "folder not found" });
    const isBotNameExist = await botModel.findOne({
      whichFolder: findFolder._id,
      botName: data.botName,
    });
    if (isBotNameExist)
      return res.status(409).json({ msg: "bot name already exist" });
    const newBot = new botModel({
      botName: data.botName,
      theme: data.theme,
      botArr: data.botArr,
      whichFolder: findFolder._id,
    });
    console.log(newBot);
    await newBot.save();
    findFolder.allBots.push(newBot._id);
    await findFolder.save();
    console.log("saveBotInFolder", findFolder);
    return res.status(200).json({ msg: "bot saved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//bot response save - API
route.post("/bot_response_save/:botId", async (req, res) => {
  try {
    const findBot = await botModel.findById(req.params.botId);
    if (!findBot) return res.status(404).json({ msg: "bot not found" });
    console.log("findBot: ", findBot);
    const savedBotResponse = await new botResponseModel({
      botResponseArr: req.body.responses,
      whichBot: req.params.botId,
    }).save();
    console.log("savedBotResponse: ", savedBotResponse);
    findBot.botResponse.push(savedBotResponse._id);
    await findBot.save();
    console.log("findBot: ", findBot);
    return res.status(200).json({
      msg: "you response has been saved",
      formId: savedBotResponse._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//bot update API
route.patch("/bot_update/:botId", checkAuth, async (req, res) => {
  try {
    const findBot = await botModel.findById(req.params.botId);
    if (!findBot) return res.status(404).json({ msg: "Bot not found" });
    if (findBot.botName !== req.body.botName) {
      const isBotNameExist = await botModel.findOne({
        botName: req.body.botName,
      });
      if (isBotNameExist)
        return res.status(409).json({ msg: "bot name already exist" });
    }
    const findUpdatedBot = await botModel.findByIdAndUpdate(
      findBot._id,
      req.body,
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Bot Updated Successfully", updatedBot: findUpdatedBot });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//delete bot and after bot delete that bot Id also deleted from folderModel API
route.delete("/bot_delete/:botId", checkAuth, async (req, res) => {
  try {
    const findBot = await botModel.findByIdAndDelete(req.params.botId);
    if (!findBot) return res.status(404).json({ msg: "Bot not found" });
    const findFolder = await folderModel.findOne({
      folderName: req.body.folderName,
      whichUser: req.loginUser._id,
    });
    findFolder.allBots = findFolder.allBots.filter(
      (botId) => botId.toString() !== req.params.botId
    );
    await findFolder.save();
    return res.status(200).json({ msg: "Bot deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//send bot response details API
route.get("/get_bot_response/:botId", async (req, res) => {
  try {
    const findBotResponse = await botModel
      .findById(req.params.botId)
      .populate("botResponse");
    if (!findBotResponse) return res.status(404).json({ msg: "bot not found" });
    return res.status(200).json({
      msg: "response deliver success",
      botResponse: findBotResponse.botResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

//check auth via jwt
function checkAuth(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  const bearerToken = token.split(" ")[1];

  if (!bearerToken) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  try {
    const user = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.loginUser = user.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
}

//check is login
route.get("/isLoginCheck", checkAuth, (req, res) => {
  return res
    .status(200)
    .json({ msg: "You are authenticated", user: req.loginUser });
});

// Update Settings API (Combine user and settings update)
route.post("/update_settings", checkAuth, async (req, res) => {
  const { name, email, oldPassword, newPassword, settings } = req.body;
  try {
    const user = await userModel.findById(req.loginUser._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Incorrect old password" });

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Update name and email
    user.name = name || user.name;
    user.email = email || user.email;

    // Update settings if provided
    if (settings) {
      user.settings = { ...user.settings, ...settings };
    }

    await user.save();
    return res.status(200).json({
      msg: "Settings updated successfully",
      settings: user.settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Get Settings API
route.get("/get_settings", checkAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.loginUser._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ settings: user.settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});
module.exports = route;
