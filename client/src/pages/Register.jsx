import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, requestOtp, verifyOtp } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import Bi from "../components/Bi";

const inputCls =
  "w-full rounded-xl border border-primary/15 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary";
const primaryBtn =
  "w-full rounded-xl bg-primary py-3 text-white hover:opacity-90 disabled:opacity-50";

const Register = () => {
  const { lang } = useLanguage();
  const t = (mr, en) => (lang === "mr" ? mr : en);

  const [mode, setMode] = useState("mobile"); // "mobile" | "email"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const switchMode = (m) => {
    setMode(m);
    setError("");
  };

  const checkConsent = () => {
    if (!agreed) {
      setError(t("कृपया संमती द्या.", "Please accept the consent to continue."));
      return false;
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError(t("१० अंकी मोबाइल क्रमांक भरा.", "Enter a valid 10-digit mobile number."));
      return;
    }
    if (!checkConsent()) return;
    setLoading(true);
    try {
      await requestOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyOtp(phone, otp);
      login(data.user, data.token);
      navigate("/create-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!checkConsent()) return;
    setLoading(true);
    try {
      const data = await registerWithEmail(email, password);
      login(data.user, data.token);
      navigate("/create-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const tab = (active) =>
    `flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
      active ? "bg-primary text-white" : "bg-blush text-gray-600"
    }`;

  return (
    <AuthLayout title={{ mr: "नवी सुरुवात करूया", en: "Create your account" }}>
      <p className="mt-3 text-sm text-gray-600">
        {t(
          "मोबाइल व OTP किंवा ईमेल व पासवर्ड वापरा.",
          "Choose mobile + OTP or email + password."
        )}
      </p>

      <div className="mt-6 flex gap-2 rounded-xl border border-primary/10 bg-blush p-1">
        <button type="button" onClick={() => switchMode("mobile")} className={tab(mode === "mobile")}>
          {t("मोबाइल + OTP", "Mobile + OTP")}
        </button>
        <button type="button" onClick={() => switchMode("email")} className={tab(mode === "email")}>
          {t("ईमेल / Gmail", "Email / Gmail")}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {mode === "mobile" && !otpSent && (
        <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">
              <Bi mr="मोबाइल क्रमांक" en="Mobile number" s="text-xs font-normal text-gray-600" />
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder={t("१० अंकी मोबाइल क्रमांक", "10-digit mobile number")}
              required
              className={inputCls}
            />
            <span className="mt-1 block text-xs text-gray-500">+91</span>
          </label>
          <ConsentBox agreed={agreed} setAgreed={setAgreed} t={t} />
          <button type="submit" disabled={loading} className={primaryBtn}>
            {loading ? t("पाठवत आहे...", "Sending...") : <Bi mr="OTP पाठवा" en="Send OTP" p="font-semibold" s="text-xs" />}
          </button>
        </form>
      )}

      {mode === "mobile" && otpSent && (
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            {t("OTP पाठवला:", "OTP sent to")} +91 {phone}
          </p>
          <div>
            <span className="mb-2 block text-sm font-semibold">
              <Bi mr="६ अंकी OTP" en="6-digit OTP" s="text-xs font-normal text-gray-600" />
            </span>
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
          </div>
          <button type="submit" disabled={loading || otp.length !== 6} className={primaryBtn}>
            {loading ? t("तपासत आहे...", "Verifying...") : <Bi mr="पडताळा व नोंदणी करा" en="Verify & Register" p="font-semibold" s="text-xs" />}
          </button>
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
              className="text-gray-500 hover:text-primary"
            >
              {t("नंबर बदला", "Change number")}
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="font-medium text-primary hover:underline"
            >
              {t("OTP पुन्हा पाठवा", "Resend OTP")}
            </button>
          </div>
        </form>
      )}

      {mode === "email" && (
        <form onSubmit={handleEmailRegister} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">
              <Bi mr="ईमेल" en="Email" s="text-xs font-normal text-gray-600" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              required
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">
              <Bi mr="पासवर्ड" en="Password" s="text-xs font-normal text-gray-600" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("किमान ६ अक्षरे", "Minimum 6 characters")}
              required
              minLength={6}
              className={inputCls}
            />
          </label>
          <ConsentBox agreed={agreed} setAgreed={setAgreed} t={t} />
          <button type="submit" disabled={loading} className={primaryBtn}>
            {loading ? t("खाते तयार होत आहे...", "Creating account...") : <Bi mr="नोंदणी करा" en="Register" p="font-semibold" s="text-xs" />}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-gray-600">
        {t("आधीच खाते आहे?", "Already have an account?")}{" "}
        <Link to="/login" className="font-medium text-primary">
          {t("लॉगिन", "Login")}
        </Link>
      </p>
    </AuthLayout>
  );
};

const ConsentBox = ({ agreed, setAgreed, t }) => (
  <label className="flex items-start gap-2 text-xs text-gray-600">
    <input
      type="checkbox"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      className="mt-0.5 accent-[#7A1F2B]"
    />
    <span>
      {t(
        "माझी माहिती साठवली जाऊ शकते व माझ्या परवानगीनेच इतर सदस्यांना दाखवली जाईल, यास माझी संमती आहे.",
        "I agree my details may be stored and shown to other members only with my permission."
      )}
    </span>
  </label>
);

export default Register;