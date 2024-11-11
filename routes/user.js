const express = require("express");
const validateJWT = require("../middlewares/validateJWT");
const {
  registerUser,
  loginUser,
  updateUserPreferences,
  getUserPreferences,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/preferences", validateJWT, getUserPreferences);

router.put("/preferences", validateJWT, updateUserPreferences);

module.exports = router;
