import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchProfiles } from "../api/profile";
import { sendInterest } from "../api/interest";

const calculateAge = (dob) => {
  const birth = new Date(dob);
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const Browse = () => {
  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sentIds, setSentIds] = useState(new Set());

  const [filters, setFilters] = useState({
    gender: "",
    minAge: "",
    maxAge: "",
    city: "",
    state: "",
    maritalStatus: "",
  });

  const fetchProfiles = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      // Strip empty filter values so we don't send "?city=" etc.
      const params = Object.fromEntries(
        Object.entries({ ...filters, page }).filter(([, v]) => v !== "")
      );
      const data = await searchProfiles(params);
      setProfiles(data.profiles);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(1);
  }, []); // initial load

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProfiles(1);
  };

  const handleSendInterest = async (userId) => {
    try {
      await sendInterest(userId);
      setSentIds((prev) => new Set(prev).add(userId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send interest");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6">Browse Matches</h1>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 rounded-xl shadow-sm mb-6 grid grid-cols-2 md:grid-cols-6 gap-3"
        >
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="border rounded-lg px-2 py-2 text-sm"
          >
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            type="number"
            name="minAge"
            placeholder="Min Age"
            value={filters.minAge}
            onChange={handleFilterChange}
            className="border rounded-lg px-2 py-2 text-sm"
          />
          <input
            type="number"
            name="maxAge"
            placeholder="Max Age"
            value={filters.maxAge}
            onChange={handleFilterChange}
            className="border rounded-lg px-2 py-2 text-sm"
          />
          <input
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
            className="border rounded-lg px-2 py-2 text-sm"
          />
          <input
            name="state"
            placeholder="State"
            value={filters.state}
            onChange={handleFilterChange}
            className="border rounded-lg px-2 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-white rounded-lg py-2 text-sm font-medium hover:opacity-90"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-500">Loading...</p>}

        {!loading && profiles.length === 0 && (
          <p className="text-gray-500">No matches found. Try adjusting your filters.</p>
        )}

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profiles.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                {p.photos?.[0]?.url ? (
                  <img
                    src={p.photos[0].url}
                    alt={p.fullName}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  "No Photo"
                )}
              </div>
              <h3 className="font-semibold text-gray-800">{p.fullName}</h3>
              <p className="text-sm text-gray-500">
                {calculateAge(p.dob)} yrs • {p.location?.city}, {p.location?.state}
              </p>
              <p className="text-sm text-gray-500">{p.occupation}</p>

              <div className="flex gap-2 mt-3">
                <Link
                  to={`/profile/${p._id}`}
                  className="flex-1 text-center border border-primary text-primary rounded-lg py-1.5 text-sm hover:bg-primary hover:text-white transition"
                >
                  View
                </Link>
                <button
                  onClick={() => handleSendInterest(p.user)}
                  disabled={sentIds.has(p.user)}
                  className="flex-1 bg-primary text-white rounded-lg py-1.5 text-sm hover:opacity-90 disabled:opacity-50"
                >
                  {sentIds.has(p.user) ? "Sent" : "Send Interest"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchProfiles(p)}
                className={`w-8 h-8 rounded-lg text-sm ${
                  p === pagination.page
                    ? "bg-primary text-white"
                    : "bg-white border text-gray-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;