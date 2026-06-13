import express from "express";

import { lookupPostalCode } from "../controllers/addressController.js";

const router = express.Router();

router.get("/postal/:postalCode", lookupPostalCode);

export default router;
