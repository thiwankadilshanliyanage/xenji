import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "xenji/services",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 900,
        height: 600,
        crop: "fill",
        quality: "auto",
      },
    ],
  },
});

export const uploadServiceImage = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});