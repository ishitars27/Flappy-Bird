const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControllers");
const getUser = require("../controllers/userControllers");
const auth = require("../middlewear/authMiddlewear");

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/get-user",auth, getUser)








module.exports = userRouter;