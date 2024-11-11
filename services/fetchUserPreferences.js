const User = require("../models/user");

const fetchUserPreferences = async (userId) => {
  const dbUser = await User.findOne({ _id: userId });

  if (!dbUser) {
    throw new Error("User not found.");
  }

  return dbUser.preferences;
};

module.exports = { fetchUserPreferences };
