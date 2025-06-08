const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Access token comes from cookies
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

    req.user = decoded;
    req.email = decoded.email; // Add this line to set req.email

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
