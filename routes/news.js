const express = require("express");
const axios = require("axios");

const validateJWT = require("../middlewares/validateJWT");
const { fetchUserPreferences } = require("../services/fetchUserPreferences");

require("dotenv").config();
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get("/", validateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const userPreferences = await fetchUserPreferences(userId);
    const categories = userPreferences.categories.join(" OR ") || "";
    const preferredLanguage = userPreferences.preferredLanguage;

    let params = {};
    if (categories) params.q = categories;
    if (preferredLanguage) params.language = preferredLanguage;

    const response = await axios.get("https://newsapi.org/v2/everything", {
      headers: {
        "X-Api-Key": NEWS_API_KEY,
      },
      params: params,
    });

    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res
      .status(error.status)
      .send({ message: "Error fetching news.", error: error.message });
  }
});

module.exports = router;
