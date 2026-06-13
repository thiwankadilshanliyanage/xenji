import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, minlength: 8, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String, default: "/uploads/default-avatar.png" },

    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String },

    preferredLanguage: { type: String, enum: ["en", "ja"], default: "en" },
    preferredTheme: { type: String, enum: ["light", "dark"], default: "light" },
    notificationPreferences: {
      service: { type: Boolean, default: true },
      information: { type: Boolean, default: true },
      important: { type: Boolean, default: true },
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isBlocked: { type: Boolean, default: false },
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.passwordResetToken;
    return ret;
  },
});

export default mongoose.model("User", userSchema);