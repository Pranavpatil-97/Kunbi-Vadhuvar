import Otp from "../models/Otp.js";

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 5;

export const generateOtp = () => {
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

// Creates and "sends" an OTP. Replace the console.log with a real SMS
// provider call (e.g. MSG91, Twilio) when you're ready to go live.
export const sendOtp = async (phone) => {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // Remove any previous unused OTPs for this phone
  await Otp.deleteMany({ phone });
  await Otp.create({ phone, code, expiresAt });

  console.log(`[DEV ONLY] OTP for ${phone}: ${code} (expires in ${OTP_TTL_MINUTES} min)`);

  return true;
};

export const verifyOtp = async (phone, code) => {
  const record = await Otp.findOne({ phone, code });
  if (!record) return false;
  if (record.expiresAt < new Date()) return false;

  await Otp.deleteOne({ _id: record._id });
  return true;
};