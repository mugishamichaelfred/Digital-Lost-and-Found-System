import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, X, LogOut, User, Settings } from "lucide-react";
import { GiRoyalLove } from "react-icons/gi";
import { Link } from "react-router-dom";

import profile from "../assets/profl.jpg"; 

const Header = ({ toggleSidebar, isMobile, sidebarOpen }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLinkClick = () => {
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "/";
  };

  return (
    <>
      <header className="bg-white shadow-sm px-3 sm:px-6 py-3 flex items-center justify-between z-30 relative">
        {/* Logo and Menu Toggle */}
        <div className="flex items-center">
          {/* Menu toggle button - only visible on mobile */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center">
            <span className="ml-2 font-semibold text-gray-800 text-lg hidden sm:inline">
              Digital Lost & Found System
            </span>
            <span className="ml-2 font-semibold text-gray-800 text-sm sm:hidden">
              DLF
            </span>
          </div>
        </div>

        {/* Search Input - Responsive positioning */}
        <div className="hidden md:flex items-center flex-1 ml-4 lg:ml-20 mr-4 relative max-w-md mx-auto">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Mobile Search Icon - only visible on mobile */}
        <button className="md:hidden p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
          <Search className="h-5 w-5" />
        </button>

        {/* Notification & Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative">
            <p>
              {
                JSON.parse(localStorage.getItem("loggedUser"))?.email.split(
                  "@"
                )[0]
              }
            </p>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="h-7 w-7 sm:h-9 sm:w-9 bg-gray-300 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <img
                src={profile}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <Link
                  to="adminsetting"
                  onClick={handleLinkClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Link>
                <hr className="my-1" />
                <Link
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Remove the logout popup JSX */}
    </>
  );
};

export default Header;
