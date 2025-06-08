const UserModel = require("../models/userModel");

const getUser = async (req, res, next) => {
  const email = req.email; 

  try {
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    res.status(200).json({
      message: "success",
      status: true,
      user: {
        name: foundUser.name,
        email: foundUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
