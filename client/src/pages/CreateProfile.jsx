import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile, getMyProfile, updateMyProfile } from "../api/profile";

const emptyForm = {
  fullName: "",
  gender: "",
  dob: "",
  heightCm: "",
  maritalStatus: "never_married",
  subCaste: "",
  gotra: "",
  motherTongue: "",
  education: "",
  occupation: "",
  annualIncome: "",
  location: { city: "", state: "", country: "India" },
  familyDetails: {
    fatherOccupation: "",
    motherOccupation: "",
    siblings: 0,
    familyType: "nuclear",
  },
  aboutMe: "",
};

const CreateProfile = () => {
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  // If a profile already exists, load it for editing instead of creating fresh
  useEffect(() => {
    getMyProfile()
      .then((data) => {
        const p = data.profile;
        setForm({
          ...emptyForm,
          ...p,
          dob: p.dob ? p.dob.slice(0, 10) : "", // format for <input type="date">
          location: p.location || emptyForm.location,
          familyDetails: p.familyDetails || emptyForm.familyDetails,
        });
        setIsEditing(true);
      })
      .catch(() => {}) // no profile yet — that's fine, stay in create mode
      .finally(() => setPageLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        annualIncome: form.annualIncome ? Number(form.annualIncome) : undefined,
      };
      if (isEditing) {
        await updateMyProfile(payload);
      } else {
        await createProfile(payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="flex justify-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-primary mb-1">
          {isEditing ? "Edit Your Profile" : "Create Your Profile"}
        </h1>
        <p className="text-gray-500 mb-6">This is what other members will see.</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-3">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2 col-span-2"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                name="heightCm"
                placeholder="Height (cm)"
                value={form.heightCm}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <select
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              >
                <option value="never_married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="awaiting_divorce">Awaiting Divorce</option>
              </select>
            </div>
          </section>

          {/* Community */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-3">Community Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="subCaste"
                placeholder="Sub-caste"
                value={form.subCaste}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                name="gotra"
                placeholder="Gotra"
                value={form.gotra}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
              <input
                name="motherTongue"
                placeholder="Mother Tongue"
                value={form.motherTongue}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2"
              />
            </div>
          </section>

          {/* Education & Career */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-3">Education & Career</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="education"
                placeholder="Education"
                value={form.education}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                name="occupation"
                placeholder="Occupation"
                value={form.occupation}
                onChange={handleChange}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                name="annualIncome"
                placeholder="Annual Income (₹)"
                value={form.annualIncome}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 col-span-2"
              />
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-3">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="City"
                value={form.location.city}
                onChange={(e) => handleNestedChange("location", "city", e.target.value)}
                required
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="State"
                value={form.location.state}
                onChange={(e) => handleNestedChange("location", "state", e.target.value)}
                required
                className="border rounded-lg px-3 py-2"
              />
            </div>
          </section>

          {/* Family */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-3">Family Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Father's Occupation"
                value={form.familyDetails.fatherOccupation}
                onChange={(e) =>
                  handleNestedChange("familyDetails", "fatherOccupation", e.target.value)
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                placeholder="Mother's Occupation"
                value={form.familyDetails.motherOccupation}
                onChange={(e) =>
                  handleNestedChange("familyDetails", "motherOccupation", e.target.value)
                }
                className="border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Number of Siblings"
                value={form.familyDetails.siblings}
                onChange={(e) =>
                  handleNestedChange("familyDetails", "siblings", Number(e.target.value))
                }
                className="border rounded-lg px-3 py-2"
              />
              <select
                value={form.familyDetails.familyType}
                onChange={(e) =>
                  handleNestedChange("familyDetails", "familyType", e.target.value)
                }
                className="border rounded-lg px-3 py-2"
              >
                <option value="nuclear">Nuclear Family</option>
                <option value="joint">Joint Family</option>
              </select>
            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="font-semibold text-gray-700 mb-3">About Me</h2>
            <textarea
              name="aboutMe"
              value={form.aboutMe}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
              placeholder="Tell others a bit about yourself..."
              className="w-full border rounded-lg px-3 py-2"
            />
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;