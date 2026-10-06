import Interest from "../models/Interest.js";
import Profile from "../models/Profile.js";

// @route POST /api/interests
// @desc  Send an interest request to another user
// body: { receiverId }
export const sendInterest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId) {
      return res.status(400).json({ message: "receiverId is required" });
    }
    if (receiverId === String(req.user._id)) {
      return res.status(400).json({ message: "You can't send interest to yourself" });
    }

    // Make sure the receiver actually has a profile
    const receiverProfile = await Profile.findOne({ user: receiverId });
    if (!receiverProfile) {
      return res.status(404).json({ message: "Receiver profile not found" });
    }

    // If the receiver already sent *you* a pending/accepted interest,
    // treat this as accepting theirs instead of creating a duplicate.
    const reverse = await Interest.findOne({ sender: receiverId, receiver: req.user._id });
    if (reverse) {
      if (reverse.status === "pending") {
        reverse.status = "accepted";
        await reverse.save();
        return res.json({ message: "Interest accepted (mutual match!)", interest: reverse });
      }
      if (reverse.status === "accepted") {
        return res.status(409).json({ message: "You are already matched with this user" });
      }
    }

    const existing = await Interest.findOne({ sender: req.user._id, receiver: receiverId });
    if (existing) {
      return res.status(409).json({ message: `Interest already ${existing.status}` });
    }

    const interest = await Interest.create({
      sender: req.user._id,
      receiver: receiverId,
    });

    res.status(201).json({ interest });
  } catch (error) {
    res.status(500).json({ message: "Failed to send interest", error: error.message });
  }
};

// @route PUT /api/interests/:id/respond
// @desc  Accept or decline a received interest request
// body: { action: "accept" | "decline" }
export const respondToInterest = async (req, res) => {
  try {
    const { action } = req.body;
    if (!["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "action must be 'accept' or 'decline'" });
    }

    const interest = await Interest.findById(req.params.id);
    if (!interest) return res.status(404).json({ message: "Interest request not found" });

    if (String(interest.receiver) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only respond to interests sent to you" });
    }
    if (interest.status !== "pending") {
      return res.status(409).json({ message: `This request was already ${interest.status}` });
    }

    interest.status = action === "accept" ? "accepted" : "declined";
    await interest.save();

    res.json({ interest });
  } catch (error) {
    res.status(500).json({ message: "Failed to respond to interest", error: error.message });
  }
};

// @route GET /api/interests/received
// @desc  Interests sent TO the logged-in user (optionally filter by status)
export const getReceivedInterests = async (req, res) => {
  try {
    const filter = { receiver: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const interests = await Interest.find(filter)
      .populate("sender", "email phone")
      .sort({ createdAt: -1 });

    res.json({ interests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch received interests", error: error.message });
  }
};

// @route GET /api/interests/sent
// @desc  Interests sent BY the logged-in user (optionally filter by status)
export const getSentInterests = async (req, res) => {
  try {
    const filter = { sender: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const interests = await Interest.find(filter)
      .populate("receiver", "email phone")
      .sort({ createdAt: -1 });

    res.json({ interests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sent interests", error: error.message });
  }
};

// @route GET /api/interests/matches
// @desc  All mutual matches (accepted, in either direction)
export const getMatches = async (req, res) => {
  try {
    const interests = await Interest.find({
      status: "accepted",
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "email phone")
      .populate("receiver", "email phone")
      .sort({ updatedAt: -1 });

    res.json({ matches: interests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch matches", error: error.message });
  }
};