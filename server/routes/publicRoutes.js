import express from "express";
import { getPublicProfiles } from "../controllers/profileController.js";

const router = express.Router();

// Deliberately NOT using `protect` — this is the public preview
router.get("/profiles", getPublicProfiles);

export default router;