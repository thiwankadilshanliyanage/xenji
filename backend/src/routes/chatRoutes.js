import express from "express";
import { chatWithXeno } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chatWithXeno);

export default router;