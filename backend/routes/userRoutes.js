const express = require("express");

const router = express.Router();

const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");

const { verifyUser } = require("../middlewares/authMiddleware");

router.route("/").post(registerUser).get(verifyUser, allUsers);

router.route("/login").post(authUser);

module.exports = router;
