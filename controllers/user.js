const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { fetchUserPreferences } = require("../services/fetchUserPreferences");

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send({
      message: "Email and password are required.",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists." });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const dbUser = await User.create({ ...req.body, password: hashedPassword });

    const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the newly created user (excluding the password)
    res
      .status(201)
      .send({ user: { id: dbUser._id, email: dbUser.email }, token });
  } catch (err) {
    res.status(400).send({
      message: "Some error occurred in creating this user.",
      error: err?.message || "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(400).send("Email not found.");
    }

    const hashedPassword = dbUser.password;
    const isPasswordSame = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordSame) {
      return res.status(400).send("Password is incorrect!");
    }

    const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.send({ success: true, token });
  } catch (err) {
    res.status(500).send("Server error.");
  }
};

const updateUserPreferences = async (req, res) => {
  const { preferences } = req.body;
  const userId = req.user.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    res.send({ user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error updating user.", error: err.message });
  }
};

const getUserPreferences = async (req, res) => {
  const userId = req.user.id;

  try {
    const userPreferences = fetchUserPreferences(userId);
    res.status(200).send({ success: true, preferences: userPreferences });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error updating user.", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserPreferences,
  getUserPreferences,
};
