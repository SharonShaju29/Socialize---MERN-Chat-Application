const express = require("express");
const { verifyUser } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(verifyUser, accessChat);
router.route("/").get(verifyUser, fetchChats);

router.route("/group").post(verifyUser, createGroupChat);
router.route("/rename").put(verifyUser, renameGroup);
router.route("/groupRemove").put(verifyUser, removeFromGroup);
router.route("/groupAdd").put(verifyUser, addToGroup);

module.exports = router;
