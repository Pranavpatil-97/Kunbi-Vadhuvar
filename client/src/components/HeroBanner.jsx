import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-primary">
          Kunbi Matrimony
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/browse" className="text-gray-600 hover:text-primary">
            Browse
          </Link>
          <Link to="/create-profile" className="text-gray-600 hover:text-primary">
            My Profile
          </Link>
          {user && (
            <span className="text-gray-400 hidden sm:inline">{user.email || user.phone}</span>
          )}
          <button
            onClick={handleLogout}
            className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;