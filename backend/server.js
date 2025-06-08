require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const googleAuth = require("./middlewear/googleAuth");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./middlewear/errorHandler");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize and Deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"  
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173", 
  }),
  googleAuth,
  (req, res, next) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);


// Success and failure routes
app.get("/success", (req, res) => res.send("Login Successful!"));
app.get("/failure", (req, res) => res.send("Login Failed!"));


app.use('/users',userRouter)
app.use('/api/scores', scoreRoutes);
app.use(errorHandler)
connectDB()
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
