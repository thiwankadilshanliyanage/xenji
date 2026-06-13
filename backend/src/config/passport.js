import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "missing-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-client-secret",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;

        if (!email) {
          return done(null, false, { message: "Google account email not found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName || "Google User",
            email,
            googleId: profile.id,
            authProvider: "google",
            isEmailVerified: true,
            avatar: photo || "/uploads/default-avatar.png",
            lastLogin: new Date(),
          });
        } else {
          user.googleId = user.googleId || profile.id;
          user.authProvider = user.authProvider || "google";
          user.isEmailVerified = true;
          user.avatar = user.avatar || photo || "/uploads/default-avatar.png";
          user.lastLogin = new Date();
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select(
      "-password -emailVerificationToken -passwordResetToken"
    );
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;