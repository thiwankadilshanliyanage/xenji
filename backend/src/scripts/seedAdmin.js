import "dotenv/config";
import mongoose from "mongoose";

import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    const adminName = process.env.ADMIN_NAME || "Xenji Admin";
    const adminEmail = process.env.ADMIN_EMAIL || "thiwankadilshanliyanage@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345!";

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({ email: adminEmail }).select("+password");

    if (existingAdmin) {
      existingAdmin.name = adminName;
      existingAdmin.password = adminPassword;
      existingAdmin.role = "admin";
      existingAdmin.authProvider = "local";
      existingAdmin.isEmailVerified = true;
      existingAdmin.isBlocked = false;

      await existingAdmin.save();

      console.log("Admin updated successfully");
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      process.exit(0);
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      authProvider: "local",
      isEmailVerified: true,
      isBlocked: false,
    });

    console.log("Admin created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exit(1);
  }
};

seedAdmin();