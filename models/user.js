const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  preferences: {
    type: {
      categories: {
        type: [String], // Array of strings for categories
        default: [], // Default to an empty array
      },
      preferredLanguage: {
        type: String,
        default: "en",
      },
    },
    default: {}, // Default to an empty object
    required: false,
  },
});

const User = mongoose.model("news-aggregator-users", userSchema);
module.exports = User;

/*
{
  "userName": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "preferences": {
    "categories": ["sports", "music"],
    "languages": ["es]
  }
}
*/
