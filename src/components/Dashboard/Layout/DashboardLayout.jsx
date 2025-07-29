import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../../contexts/AuthContext/AuthProvider';
import { LogOut, User as UserIcon, Settings as SettingsIcon, HelpCircle, ChevronDown, Home, FileText, Plus, MessageSquare, CreditCard, BarChart3 } from 'lucide-react';

// Navigation icons
const navigationIcons = {
  User: (props) => <UserIcon {...props} />,
  FileText: (props) => <FileText {...props} />,
  Plus: (props) => <Plus {...props} />,
  MessageSquare: (props) => <MessageSquare {...props} />,
  CreditCard: (props) => <CreditCard {...props} />,
  BarChart3: (props) => <BarChart3 {...props} />,
  Settings: (props) => <SettingsIcon {...props} />,
  Home: (props) => <Home {...props} />
};

const navigation = [
  { name: 'Profile', icon: 'User', href: '?tab=profile' },
  { name: 'My Posts', icon: 'FileText', href: '?tab=posts' },
  { name: 'Add Post', icon: 'Plus', href: '?tab=add-post' },
  { name: 'My Comments', icon: 'MessageSquare', href: '?tab=comments' },
  { name: 'Payments', icon: 'CreditCard', href: '?tab=payments' },
  { name: 'Stats', icon: 'BarChart3', href: '?tab=stats' },
];

const DashboardLayout = ({ children, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'profile';
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  // Function to check if a navigation item is active
  const isActive = (href) => {
    const tab = new URLSearchParams(href.split('?')[1]).get('tab') || 'profile';
    return tab === activeTab;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              <Home className="h-6 w-6" />
            </Link>
            <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            onClick={() => {
              // Toggle mobile menu
              const mobileMenu = document.getElementById('mobile-menu');
              if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
              }
            }}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {/* Mobile menu, show/hide based on menu state */}
        <div id="mobile-menu" className="hidden lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const IconComponent = navigationIcons[item.icon];
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <IconComponent
                    className={`${
                      isActive(item.href)
                        ? 'text-gray-500 dark:text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                    } mr-3 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                <Home className="h-8 w-8" />
              </Link>
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const IconComponent = navigationIcons[item.icon];
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <IconComponent
                      className={`${
                        isActive(item.href)
                          ? 'text-gray-500 dark:text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      } mr-3 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="relative w-full" ref={profileRef}>
              <button
                type="button"
                className="flex items-center w-full text-left focus:outline-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-9 w-9 rounded-full"
                    src={user?.photoURL || '/default-avatar.svg'}
                    alt={user?.displayName || 'User'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.svg';
                    }}
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || ''}
                  </p>
                </div>
                <ChevronDown 
                  className={`ml-2 h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`} 
                  aria-hidden="true" 
                />
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute bottom-full left-0 right-0 mb-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to="/dashboard?tab=profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <UserIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard?tab=settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <SettingsIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Settings
                    </Link>
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
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8">
          {/* Page header */}
          <div className="bg-white dark:bg-gray-800 shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {navigation.find((item) => {
                      const tab = new URLSearchParams(item.href.split('?')[1]).get('tab') || 'profile';
                      return tab === activeTab;
                    })?.name || 'Dashboard'}
                  </h1>
                </div>
                <div className="mt-4 flex items-center md:mt-0 md:ml-4">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
