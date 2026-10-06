import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Report from "../models/Report.js";

// @route GET /api/admin/users
// @desc  List all users, with optional filters
// query: ?isVerified=false&isActive=true&page=1&limit=20
export const listUsers = async (req, res) => {
  try {
    const { isVerified, isActive, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    res.json({ users, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (error) {
    res.status(500).json({ message: "Failed to list users", error: error.message });
  }
};

// @route PUT /api/admin/users/:id/verify
// @desc  Mark a user's profile as verified (adds the "verified" badge)
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "User verified", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify user", error: error.message });
  }
};

// @route PUT /api/admin/users/:id/ban
// @desc  Deactivate (ban) a user — blocks login and hides them from search
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot ban another admin" });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: "User banned", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to ban user", error: error.message });
  }
};

// @route PUT /api/admin/users/:id/unban
export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = true;
    await user.save();

    res.json({ message: "User unbanned", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to unban user", error: error.message });
  }
};

// @route DELETE /api/admin/users/:id
// @desc  Permanently delete a user + their profile (use sparingly — prefer ban)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete another admin" });
    }

    await Profile.deleteOne({ user: user._id });
    await user.deleteOne();

    res.json({ message: "User deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// @route GET /api/admin/reports
// @desc  List reports, optionally filtered by status
export const listReports = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const reports = await Report.find(filter)
      .populate("reporter", "email phone")
      .populate("reportedUser", "email phone isActive")
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (error) {
    res.status(500).json({ message: "Failed to list reports", error: error.message });
  }
};

// @route PUT /api/admin/reports/:id
// @desc  Mark a report reviewed or dismissed
// body: { status: "reviewed" | "dismissed" }
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["reviewed", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "status must be 'reviewed' or 'dismissed'" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = status;
    report.reviewedBy = req.user._id;
    await report.save();

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: "Failed to update report", error: error.message });
  }
};