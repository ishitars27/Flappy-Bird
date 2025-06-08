const generateToken = require("../controllers/googleAuthControllers");
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

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

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
     
    });

    req.userInfo = user;

    next();
  } catch (error) {
    console.error("Google Auth Middleware Error:", error);
    next(error);
  }
};

module.exports = googleAuth;
