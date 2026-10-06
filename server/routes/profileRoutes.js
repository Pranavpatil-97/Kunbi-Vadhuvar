import express from "express";
import {
  createProfile,
  getMyProfile,
  updateMyProfile,
  getProfileById,
  searchProfiles,
} from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createProfile);
router.get("/", protect, searchProfiles);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.get("/:id", protect, getProfileById);

export default router;