import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMatches } from "../api/interest";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMatches()
      .then((data) => setMatches(data.matches))
      .catch((err) => setError(err.response?.data?.message || "Failed to load matches"))
      .finally(() => setLoading(false));
  }, []);

  // For each match, figure out who the "other person" is (could be sender or receiver)
  const getOtherUser = (m) => {
    const senderId = m.sender._id || m.sender;
    return senderId === user.id ? m.receiver : m.sender;
  };

  return (
    <div className="min-h-screen bg-blush">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl text-gray-800 mb-6">Your Matches</h1>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && matches.length === 0 && (
          <p className="text-gray-500 text-sm">
            No matches yet. Send interest to profiles you like — once it's mutual, you'll be able
            to chat here.
          </p>
        )}

        <div className="space-y-3">
          {matches.map((m) => {
            const other = getOtherUser(m);
            return (
              <Link
                key={m._id}
                to={`/chat/${other._id || other}`}
                className="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {(other.email || other.phone || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{other.email || other.phone}</p>
                  <p className="text-xs text-gray-500">Matched • Tap to chat</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Matches;