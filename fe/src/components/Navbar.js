import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // Added signOut for logout functionality
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyles = `
    font-medium transition-colors duration-300
    ${scrolled ? "text-blue-600 hover:text-blue-800" : "text-white hover:text-blue-300"}
  `;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 h-[72px] ${
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <Link
            to="/home"
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: scrolled ? "#2563eb" : "white" }}
          >
            RoommateFinder
          </Link>
          {/* Hamburger Menu */}
          <button
            className={`block lg:hidden focus:outline-none ${
              scrolled ? "text-blue-600" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/home" className={linkStyles}>
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={linkStyles}>
                  Dashboard
                </Link>
                <Link to="/profile" className={linkStyles}>
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className={`${linkStyles} bg-transparent border-none cursor-pointer`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className={linkStyles}>
                  Sign In
                </Link>
                <Link to="/signup" className={linkStyles}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          className={`lg:hidden flex flex-col space-y-4 mt-4 bg-white rounded-lg p-4 transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <Link to="/home" className="text-[#2563eb] font-medium">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-[#2563eb] font-medium">
                Dashboard
              </Link>
              <Link to="/profile" className="text-[#2563eb] font-medium">
                Profile
              </Link>
              <button onClick={logout} className="text-[#2563eb] font-medium text-left">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-[#2563eb] font-medium">
                Sign In
              </Link>
              <Link to="/signup" className="text-[#2563eb] font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
