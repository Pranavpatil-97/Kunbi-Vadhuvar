import express from "express";
import { getConversation, listConversations } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listConversations);
router.get("/:userId", protect, getConversation);

export default router;