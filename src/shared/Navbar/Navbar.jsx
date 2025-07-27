import React, { useState } from "react";
import { Link } from "react-router";
import { Bell, Menu, X } from "lucide-react"; // make sure lucide-react is installed
import qcktlkLogo from "../../assets/qcktlk.png";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Website Name */}
          <Link to="/" className="flex items-center">
            <img
              src={qcktlkLogo}
              alt="QckTlk Logo"
              className="h-8 w-8 mr-2"
            />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              QckTlk
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/membership"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
            >
              Membership
            </Link>
            <Link
              to="/notifications"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
            >
              <Bell className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Side (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-600"
                title={user.displayName || "User"}
              />
            ) : (
              <Link to="/login" className="btn-primary">
                Join Us
              </Link>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/membership"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Membership
            </Link>
            <Link
              to="/notifications"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Notifications
            </Link>

            {user ? (
              <div className="flex items-center space-x-3 mt-2">
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {user.displayName}
                </span>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary mt-2 w-max"
                onClick={() => setMenuOpen(false)}
              >
                Join Us
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
