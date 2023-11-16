const express = require("express");
const { verifyUser } = require("../middlewares/authMiddleware");
const {sendMessage,allMessages} = require("../controllers/messageController")

const router = express.Router();

router.route('/').post(verifyUser,sendMessage);
router.route('/:chatId').get(verifyUser,allMessages)

module.exports = router;
