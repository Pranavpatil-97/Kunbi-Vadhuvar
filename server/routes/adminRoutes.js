import express from "express";
import {
  listUsers,
  verifyUser,
  banUser,
  unbanUser,
  deleteUser,
  listReports,
  updateReportStatus,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Every route here requires both a valid token AND role === "admin"
router.use(protect, adminOnly);

router.get("/users", listUsers);
router.put("/users/:id/verify", verifyUser);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);
router.delete("/users/:id", deleteUser);

router.get("/reports", listReports);
router.put("/reports/:id", updateReportStatus);

export default router;