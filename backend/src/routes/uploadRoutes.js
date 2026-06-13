import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { uploadServiceImage } from "../middleware/serviceUploadMiddleware.js";
import { uploadServiceThumbnail } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/service-image",
  protect,
  adminOnly,
  uploadServiceImage.single("image"),
  uploadServiceThumbnail
);

export default router;