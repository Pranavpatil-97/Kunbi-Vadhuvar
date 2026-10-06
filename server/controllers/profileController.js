import Profile from "../models/Profile.js";
import User from "../models/User.js";

const REQUIRED_FIELDS = ["fullName", "gender", "dob"];

const isProfileComplete = (data) => {
  return Boolean(
    data.fullName &&
    data.gender &&
    data.dob &&
    data.location?.city &&
    data.education &&
    data.occupation
  );
};
// ---------------- CREATE PROFILE ----------------

// @route POST /api/profiles
export const createProfile = async (req, res) => {
  try {
    const existing = await Profile.findOne({ user: req.user._id });

    if (existing) {
      return res.status(409).json({
        message: "Profile already exists, use update instead",
      });
    }

    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `${field} is required`,
        });
      }
    }

    const profile = await Profile.create({
      ...req.body,
      user: req.user._id,
      profileCompleted: isProfileComplete(req.body),
    });

    res.status(201).json({ profile });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create profile",
      error: error.message,
    });
  }
};

// ---------------- MY PROFILE ----------------

// @route GET /api/profiles/me
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile)
      return res.status(404).json({
        message: "Profile not found",
      });

    res.json({ profile });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// ---------------- UPDATE PROFILE ----------------

// @route PUT /api/profiles/me
export const updateMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile)
      return res.status(404).json({
        message: "Profile not found",
      });

    Object.assign(profile, req.body);

    profile.profileCompleted = isProfileComplete(profile.toObject());

    await profile.save();

    res.json({ profile });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ---------------- SEARCH PROFILES ----------------

// @route GET /api/profiles
// @desc Search profiles with filters + pagination
export const searchProfiles = async (req, res) => {
  try {
    const {
      gender,
      minAge,
      maxAge,
      city,
      state,
      subCaste,
      education,
      maritalStatus,
      motherTongue,
      page = 1,
      limit = 20,
    } = req.query;

    const bannedUserIds = await User.find({
  isActive: false,
}).distinct("_id");

const query = {
  user: {
    $ne: req.user._id,
    $nin: bannedUserIds,
  },
};

    if (gender) query.gender = gender;
    if (maritalStatus) query.maritalStatus = maritalStatus;

    if (city)
      query["location.city"] = new RegExp(`^${city}$`, "i");

    if (state)
      query["location.state"] = new RegExp(`^${state}$`, "i");

    if (subCaste)
      query.subCaste = new RegExp(`^${subCaste}$`, "i");

    if (education)
      query.education = new RegExp(education, "i");

    if (motherTongue)
      query.motherTongue = new RegExp(`^${motherTongue}$`, "i");

    if (minAge || maxAge) {
      query.dob = {};

      const today = new Date();

      if (minAge) {
        const maxDob = new Date(today);
        maxDob.setFullYear(today.getFullYear() - Number(minAge));
        query.dob.$lte = maxDob;
      }

      if (maxAge) {
        const minDob = new Date(today);
        minDob.setFullYear(today.getFullYear() - Number(maxAge) - 1);
        query.dob.$gte = minDob;
      }
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [profiles, total] = await Promise.all([
      Profile.find(query)
        .select("-familyDetails -aboutMe")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Profile.countDocuments(query),
    ]);

    res.json({
      profiles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
};

// ---------------- VIEW PROFILE ----------------

// @route GET /api/profiles/:id
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id).populate(
      "user",
      "isVerified"
    );

    if (!profile)
      return res.status(404).json({
        message: "Profile not found",
      });

    const data = profile.toObject();

    if (data.contactVisibility === "hidden") {
      delete data.familyDetails;
    }

    res.json({ profile: data });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};
// @route GET /api/public/profiles
// @desc  Public preview — limited fields only, no auth required
export const getPublicProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({})
      .select("fullName gender dob location education occupation")
      .sort({ createdAt: -1 })
      .limit(12);

    // Strip down further so nothing sensitive leaks to logged-out visitors
    const preview = profiles.map((p) => ({
      id: p._id,
      firstName: p.fullName.split(" ")[0],
      gender: p.gender,
      age: Math.floor((Date.now() - new Date(p.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
      city: p.location?.city,
      state: p.location?.state,
      education: p.education,
      occupation: p.occupation,
    }));

    res.json({ profiles: preview });
  } catch (error) {
    res.status(500).json({ message: "Failed to load preview profiles", error: error.message });
  }
};