import express from "express";
import {
  sendInterest,
  respondToInterest,
  getReceivedInterests,
  getSentInterests,
  getMatches,
} from "../controllers/interestController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, sendInterest);
router.put("/:id/respond", protect, respondToInterest);
router.get("/received", protect, getReceivedInterests);
router.get("/sent", protect, getSentInterests);
router.get("/matches", protect, getMatches);

export default router;