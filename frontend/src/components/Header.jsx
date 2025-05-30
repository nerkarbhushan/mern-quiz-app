import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Header = () => {
  const { user, logout, timeLeft } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Format time
  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${min}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <header className="bg-blue-600 text-white py-3 px-6 shadow flex justify-between items-center">
      <h1 className="text-lg font-bold">Quiz App</h1>
      <nav className="space-x-4 flex items-center">
        {user ? (
          <>
            {user.role === "admin" ? (
              <>
                <Link to="/admin/upload" className="hover:underline">
                  Upload Quiz
                </Link>
                <Link to="/admin/scores" className="hover:underline">
                  Scores
                </Link>
              </>
            ) : (
              <>
                <Link to="/user/quiz" className="hover:underline">
                  Play Quiz
                </Link>
                <Link to="/user/scorecard" className="hover:underline">
                  Scorecard
                </Link>
                {user && (
                  <span className="bg-gray-800 text-white px-2 py-1 rounded text-sm">
                    ⏳ {formatTime(timeLeft)}
                  </span>
                )}
              </>
            )}
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
