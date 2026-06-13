import User from "../models/User.js";
import { createRawToken, hashToken } from "../utils/hashToken.js";
import { generateToken } from "../utils/generateToken.js";
import { sanitizeUser } from "../utils/sendResponse.js";
import { sendVerificationEmail, sendResetEmail } from "../services/emailService.js";
import { isEmail, isStrongPassword } from "../utils/validators.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (!isEmail(email) || !isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: "Invalid email or weak password" });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const raw = createRawToken();

    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local",
      emailVerificationToken: hashToken(raw),
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(user, raw);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      token: generateToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.password && user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Login. Please continue with Google.",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: "Account blocked" });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const logout = async (req, res) => {
  req.logout?.(() => {});

  if (req.session) {
    req.session.destroy(() => {});
  }

  res.clearCookie("connect.sid");

  res.json({
    success: true,
    message: "Logged out",
  });
};

export const googleCallback = async (req, res) => {
  const token = generateToken(req.user);
  const user = encodeURIComponent(JSON.stringify(sanitizeUser(req.user)));

  const redirectUrl = `${process.env.CLIENT_URL}/auth/google/callback?token=${token}&user=${user}`;
  res.redirect(redirectUrl);
};

export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: hashToken(req.params.token),
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Email verified" });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.isEmailVerified) {
      return res.json({ success: true, message: "Email already verified" });
    }

    const raw = createRawToken();

    user.emailVerificationToken = hashToken(raw);
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();
    await sendVerificationEmail(user, raw);

    res.json({ success: true, message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user && user.authProvider !== "google") {
      const raw = createRawToken();

      user.passwordResetToken = hashToken(raw);
      user.passwordResetExpires = Date.now() + 30 * 60 * 1000;

      await user.save();
      await sendResetEmail(user, raw);
    }

    res.json({
      success: true,
      message: "If the email exists, reset instructions were sent",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      passwordResetToken: hashToken(req.params.token),
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    if (!isStrongPassword(req.body.password)) {
      return res.status(400).json({ success: false, message: "Weak password" });
    }

    user.password = req.body.password;
    user.authProvider = user.authProvider || "local";
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};