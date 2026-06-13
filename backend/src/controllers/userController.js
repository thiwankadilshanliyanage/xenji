import User from "../models/User.js";
import Bookmark from "../models/Bookmark.js";
import { sanitizeUser } from "../utils/sendResponse.js";

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowed = [
      "name",
      "preferredLanguage",
      "preferredTheme",
      "notificationPreferences",
    ];

    const update = {};

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      returnDocument: "after",
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const avatarUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: avatarUrl,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Avatar updated",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (!user || !(await user.matchPassword(req.body.currentPassword))) {
      return res.status(400).json({
        success: false,
        message: "Current password is wrong",
      });
    }

    user.password = req.body.newPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password changed",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: "Account deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id,
    })
      .populate("itemId")
      .sort("-createdAt");

    res.json({
      success: true,
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    next(error);
  }
};