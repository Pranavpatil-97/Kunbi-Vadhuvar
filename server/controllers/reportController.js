import Report from "../models/Report.js";

// @route POST /api/reports
// @desc  Any logged-in user reports another user
// body: { reportedUserId, reason, details }
export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reason, details } = req.body;
    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: "reportedUserId and reason are required" });
    }
    if (reportedUserId === String(req.user._id)) {
      return res.status(400).json({ message: "You can't report yourself" });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUserId,
      reason,
      details,
    });

    res.status(201).json({ report });
  } catch (error) {
    res.status(500).json({ message: "Failed to create report", error: error.message });
  }
};