import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    dob: { type: Date, required: true },
    heightCm: { type: Number },
    maritalStatus: {
      type: String,
      enum: ["never_married", "divorced", "widowed", "awaiting_divorce"],
      default: "never_married",
    },

    // Community-specific fields
    subCaste: { type: String, trim: true }, // e.g. specific Kunbi sub-group
    gotra: { type: String, trim: true },
    motherTongue: { type: String, trim: true },

    education: { type: String, trim: true },
    occupation: { type: String, trim: true },
    annualIncome: { type: Number }, // store in INR, display formatting on frontend

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
    },

    familyDetails: {
      fatherOccupation: { type: String, trim: true },
      motherOccupation: { type: String, trim: true },
      siblings: { type: Number, default: 0 },
      familyType: { type: String, enum: ["nuclear", "joint"], default: "nuclear" },
    },

    aboutMe: { type: String, maxlength: 1000 },

    photos: [
      {
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Privacy: controls whether contact info is visible to all, only mutual interests, or nobody
    contactVisibility: {
      type: String,
      enum: ["everyone", "mutual_interest_only", "hidden"],
      default: "mutual_interest_only",
    },

    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;