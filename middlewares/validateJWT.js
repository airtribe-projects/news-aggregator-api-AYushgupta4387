const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "Unauthorized access." });
  }

  try {
    // Modify req body
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;

    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized access." });
  }
};

module.exports = validateJWT;
