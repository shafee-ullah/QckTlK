import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X, ChevronDown, LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import qcktlkLogo from "../../assets/qcktlk.png";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../../components/ThemeToggle";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown and handle outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      console.log('Click detected outside');
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        console.log('Closing dropdown');
        setProfileDropdownOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (profileDropdownOpen) {
      console.log('Adding click listener');
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      console.log('Removing click listener');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);  // Only re-run when profileDropdownOpen changes

  const handleSignOut = async () => {
    console.log('Sign out button clicked');
    try {
      await logOut();
      setProfileDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 navbar-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Website Name */}
          <Link to="/" className="flex items-center">
            <img src={qcktlkLogo} alt="QckTlk Logo" className="h-8 w-8 mr-2" />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
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
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              >
                My Dashboard
              </Link>
            )}
              {!user && (
              <Link
                to="/become-member"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              >
                Become a Member
              </Link>
            )}
              {user && (
              <Link
                to="/membership"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              >
                Membership
              </Link>
            )}
              <Link
              to="/about"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
            >
              Contact
            </Link>
          
          
          </div>

          {/* Right Side (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="flex items-center space-x-2 focus:outline-none group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    <img
                      src={user.photoURL || '/default-avatar.svg'}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-blue-600 transition-transform duration-200 group-active:scale-95"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.svg';
                      }}
                    />
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropdownOpen ? 'transform rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <UserIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Your Profile
                      </Link>
                      {/* <Link
                        to="/dashboard?tab=settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <SettingsIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Settings
                      </Link> */}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <LogOut className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Join Us
              </Link>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Button (Mobile) */}
            <ThemeToggle />

            {/* Hamburger Menu (Mobile) */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-black dark:text-white">
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                My Dashboard
              </Link>
            )}
              <Link
              to="/about"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            {!user && (
              <Link
                to="/become-member"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Become a Member
              </Link>
            )}
            {user && (
              <Link
                to="/membership"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Membership
              </Link>
            )}
            {user ? (
              <div className="relative mt-2" ref={profileRef}>
                <button
                  type="button"
                  className="flex items-center space-x-2 focus:outline-none group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    <img
                      src={user.photoURL || '/default-avatar.svg'}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-blue-600 transition-transform duration-200 group-active:scale-95"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.svg';
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {user.displayName}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropdownOpen ? 'transform rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <UserIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Your Profile
                      </Link>
                      {/* <Link
                        to="/dashboard?tab=settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <SettingsIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Settings
                      </Link> */}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <LogOut className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
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
