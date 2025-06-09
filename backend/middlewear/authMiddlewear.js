const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel"); // Import the User Model

const auth = async (req, res, next) => {
  try {
    // Access token comes from cookies
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);

    // Find the user by email and attach the full user object to req.user
    const user = await UserModel.findOne({ email: decoded.email }).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Now req.user will contain the full user object, including _id
    req.email = decoded.email; // Keep req.email for consistency if needed elsewhere

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
