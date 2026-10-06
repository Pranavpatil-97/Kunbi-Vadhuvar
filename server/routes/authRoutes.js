import express from "express";
import {
  registerWithEmail,
  loginWithEmail,
  requestPhoneOtp,
  verifyPhoneOtp,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerWithEmail);
router.post("/login", loginWithEmail);
router.post("/otp/request", requestPhoneOtp);
router.post("/otp/verify", verifyPhoneOtp);
router.get("/me", protect, getMe);

export default router;