const generateToken = require("../controllers/googleAuthControllers");
const UserModel = require("../models/userModel");

const googleAuth = async (req, res) => {
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

    res.redirect(`https://flappybird-fdme.vercel.app/auth-success?token=${accessToken}`);
  } catch (error) {
    console.error("Google Auth Middleware Error:", error);
    res.redirect(`https://flappybird-fdme.vercel.app/login?error=auth_failed`);
  }
};

module.exports = googleAuth;
