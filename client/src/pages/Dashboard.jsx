import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyProfile } from "../api/profile";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then((data) => setProfile(data.profile))
      .catch(() => setProfileMissing(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-blush">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <HeroBanner name={profile?.fullName} />

        {!loading && profileMissing && (
          <div className="bg-white border border-gold/30 rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-display text-lg text-gray-800 mb-1">
                Your profile isn't set up yet
              </p>
              <p className="font-sans text-sm text-gray-500">
                Complete it so others can find and match with you.
              </p>
            </div>
            <Link
              to="/create-profile"
              className="bg-primary text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 whitespace-nowrap"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {!loading && profile && !profile.profileCompleted && (
          <div className="bg-white border border-gold/30 rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-display text-lg text-gray-800 mb-1">
                Your profile is incomplete
              </p>
              <p className="font-sans text-sm text-gray-500">
                Fill in the remaining details for better matches.
              </p>
            </div>
            <Link
  to="/matches"
  className="group bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition border border-transparent hover:border-gold/40"
>
  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary text-lg">
    ✉
  </div>
  <h3 className="font-display text-lg text-gray-800 mb-1">Matches & Chat</h3>
  <p className="font-sans text-sm text-gray-500">
    See your mutual matches and start chatting
  </p>
</Link>
          </div>
        )}

        {/* Quick action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/browse"
            className="group bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition border border-transparent hover:border-gold/40"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary text-lg">
              ♥
            </div>
            <h3 className="font-display text-lg text-gray-800 mb-1">Browse Matches</h3>
            <p className="font-sans text-sm text-gray-500">
              Search profiles by age, location, education
            </p>
          </Link>

          <Link
            to="/create-profile"
            className="group bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition border border-transparent hover:border-gold/40"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary text-lg">
              ✎
            </div>
            <h3 className="font-display text-lg text-gray-800 mb-1">My Profile</h3>
            <p className="font-sans text-sm text-gray-500">
              View or edit your profile details
            </p>
          </Link>

          <div className="bg-white/60 rounded-2xl shadow-sm p-6 opacity-60 cursor-not-allowed border border-transparent">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-gray-400 text-lg">
              ✉
            </div>
            <h3 className="font-display text-lg text-gray-800 mb-1">Interests</h3>
            <p className="font-sans text-sm text-gray-500">Coming in the next update</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;