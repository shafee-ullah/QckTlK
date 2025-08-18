import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/AuthContext/Theme/ThemeProvider';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDarkMode ? 'focus:ring-blue-500' : 'focus:ring-amber-400'
      } ${
        isDarkMode ? 'bg-blue-600' : 'bg-amber-400'
      }`}
      role="switch"
      aria-checked={isDarkMode}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Sliding circle */}
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-300 ${
          isDarkMode ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      
      {/* Icons */}
      <Sun 
        className={`absolute left-1 w-3 h-3 transition-opacity duration-300  ${
          isDarkMode ? 'opacity-0' : 'opacity-100 text-yellow-100'
        }`}
      />
      <Moon 
        className={`absolute right-1 w-3 h-3 transition-opacity duration-300 ${
          isDarkMode ? 'opacity-100 text-blue-200' : 'opacity-0'
        }`}
      />
    </button>
  );
};

export default ThemeToggle; 