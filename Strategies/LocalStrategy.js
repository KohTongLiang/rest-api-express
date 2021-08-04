const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../Model/User")

// Called during login/sign up.
passport.use(new LocalStrategy(User.authenticate()))

// Called while after logging in / signing up to set user details in req.user
passport.serializeUser(User.serializeUser())