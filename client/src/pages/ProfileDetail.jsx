import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProfileById } from "../api/profile";
import { sendInterest } from "../api/interest";

const calculateAge = (dob) => {
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const ProfileDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interestSent, setInterestSent] = useState(false);
  const [interestError, setInterestError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getProfileById(id)
      .then((data) => setProfile(data.profile))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendInterest = async () => {
    setInterestError("");
    try {
      await sendInterest(profile.user._id || profile.user);
      setInterestSent(true);
    } catch (err) {
      setInterestError(err.response?.data?.message || "Failed to send interest");
    }
  };

  if (loading) return <div className="flex justify-center mt-20">Loading...</div>;
  if (error) return <div className="flex justify-center mt-20 text-red-500">{error}</div>;
  if (!profile) return null;

  const InfoRow = ({ label, value }) =>
    value ? (
      <div className="flex justify-between py-2 border-b last:border-0">
        <span className="text-gray-500 text-sm">{label}</span>
        <span className="text-gray-800 text-sm font-medium">{value}</span>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/browse" className="text-primary text-sm mb-4 inline-block">
          ← Back to Browse
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="h-56 bg-gray-100 flex items-center justify-center">
            {profile.photos?.[0]?.url ? (
              <img
                src={profile.photos[0].url}
                alt={profile.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400">No Photo</span>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-2xl font-bold text-gray-800">{profile.fullName}</h1>
              {profile.user?.isVerified && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <p className="text-gray-500 mb-4">
              {calculateAge(profile.dob)} yrs • {profile.location?.city}, {profile.location?.state}
            </p>

            {interestError && <p className="text-red-500 text-sm mb-3">{interestError}</p>}

            <button
              onClick={handleSendInterest}
              disabled={interestSent}
              className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:opacity-90 disabled:opacity-50 mb-6"
            >
              {interestSent ? "Interest Sent" : "Send Interest"}
            </button>

            {/* About */}
            {profile.aboutMe && (
              <div className="mb-6">
                <h2 className="font-semibold text-gray-700 mb-2">About</h2>
                <p className="text-gray-600 text-sm">{profile.aboutMe}</p>
              </div>
            )}

            {/* Basic Info */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">Basic Info</h2>
              <InfoRow label="Height" value={profile.heightCm ? `${profile.heightCm} cm` : null} />
              <InfoRow
                label="Marital Status"
                value={profile.maritalStatus?.replace(/_/g, " ")}
              />
              <InfoRow label="Mother Tongue" value={profile.motherTongue} />
            </div>

            {/* Community */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">Community</h2>
              <InfoRow label="Sub-caste" value={profile.subCaste} />
              <InfoRow label="Gotra" value={profile.gotra} />
            </div>

            {/* Career */}
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">Education & Career</h2>
              <InfoRow label="Education" value={profile.education} />
              <InfoRow label="Occupation" value={profile.occupation} />
              <InfoRow
                label="Annual Income"
                value={profile.annualIncome ? `₹${profile.annualIncome.toLocaleString()}` : null}
              />
            </div>

            {/* Note: familyDetails only present if contactVisibility isn't "hidden" (backend controls this) */}
            {profile.familyDetails && (
              <div>
                <h2 className="font-semibold text-gray-700 mb-2">Family Details</h2>
                <InfoRow label="Father's Occupation" value={profile.familyDetails.fatherOccupation} />
                <InfoRow label="Mother's Occupation" value={profile.familyDetails.motherOccupation} />
                <InfoRow label="Siblings" value={profile.familyDetails.siblings} />
                <InfoRow
                  label="Family Type"
                  value={
                    profile.familyDetails.familyType
                      ? profile.familyDetails.familyType.charAt(0).toUpperCase() +
                        profile.familyDetails.familyType.slice(1)
                      : null
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;