const generateToken = require("../controllers/googleAuthControllers");
const UserModel = require("../models/userModel");

const googleAuth = async (req, res, next) => {
  try {
    const email = req.user?._json?.email;

    if (!email) {
      return res.status(400).json({ message: "Email not found in user profile." });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = new UserModel({
        name: req.user._json.name,
        email: email,
      });
      await user.save();
    }

    const accessToken = generateToken(user.email);

    // ✅ Send token in JSON response instead of cookie
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Google Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = googleAuth;
