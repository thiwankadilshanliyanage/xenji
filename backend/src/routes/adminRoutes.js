import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  auditLogs,
  blockUser,
  dashboard,
  deleteMessage,
  deleteReport,
  deleteUser,
  getSettings,
  listMessages,
  listReports,
  listUsers,
  markMessageRead,
  unblockUser,
  updateReportStatus,
  updateSettings,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", dashboard);

router.get("/users", listUsers);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.delete("/users/:id", deleteUser);

router.get("/messages", listMessages);
router.put("/messages/:id/read", markMessageRead);
router.delete("/messages/:id", deleteMessage);

router.get("/reports", listReports);
router.put("/reports/:id/status", updateReportStatus);
router.delete("/reports/:id", deleteReport);

router.get("/settings", getSettings);
router.put("/settings", updateSettings);

router.get("/audit-logs", auditLogs);

export default router;