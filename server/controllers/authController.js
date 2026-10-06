import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import { sendOtp, verifyOtp } from "../utils/otp.js";

// Shape the user object we send back (never include password)
const publicUser = (user) => ({
  id: user._id,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  isPhoneVerified: user.isPhoneVerified,
  isVerified: user.isVerified,
});

// @route POST /api/auth/register
// @desc  Register with email + password
export const registerWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ email: email.toLowerCase(), password });
    const token = generateToken(user._id);

    res.status(201).json({ user: publicUser(user), token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @route POST /api/auth/login
// @desc  Login with email + password
export const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    const token = generateToken(user._id);
    res.json({ user: publicUser(user), token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @route POST /api/auth/otp/request
// @desc  Request an OTP for a phone number (used for both signup & login)
export const requestPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    await sendOtp(phone);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// @route POST /api/auth/otp/verify
// @desc  Verify OTP; creates the user on first-time login
export const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ message: "Phone and code are required" });
    }

    const isValid = await verifyOtp(phone, code);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, isPhoneVerified: true });
    } else if (!user.isPhoneVerified) {
      user.isPhoneVerified = true;
      await user.save();
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    const token = generateToken(user._id);
    res.json({ user: publicUser(user), token });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};

// @route GET /api/auth/me
// @desc  Get currently logged-in user
export const getMe = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};