require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const connectDB = require("./config/db");
const googleAuth = require("./middlewear/googleAuth");
const userRouter = require("./routes/userRoutes");
const errorHandler = require("./middlewear/errorHandler");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();

// ✅ CORS — no credentials now (since we removed cookies)
app.use(
  cors({
    origin: "https://flappybird-fdme.vercel.app",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Remove cookieParser and express-session
// ✅ Also remove app.use(session(...))

// Passport middleware
app.use(passport.initialize());

// Passport Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback", // Use prod value in deployment
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize and Deserialize (optional now)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 🛠 Routes

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// ✅ Instead of redirecting, send token JSON response
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false, // ✅ Avoid session usage
    failureRedirect: "https://flappybird-fdme.vercel.app",
  }),
  googleAuth // This sends back token + user info as JSON
);

// ✅ Optional testing routes
app.get("/success", (req, res) => res.send("Login Successful!"));
app.get("/failure", (req, res) => res.send("Login Failed!"));

// 🔧 Protected and API Routes
app.use("/users", userRouter);
app.use("/api/scores", scoreRoutes);

// 🔧 Error handler
app.use(errorHandler);

// ✅ Connect DB and start server
connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
