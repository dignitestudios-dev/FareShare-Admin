import React, { useContext, useState, useRef, useEffect } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import NotificationDropdown from "../components/app/notifications/NotificationDropdown";

const Navbar = () => {
  const { handleLogout } = useContext(GlobalContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="w-full h-[60px] bg-gray-50 border-b flex justify-end items-center px-4">
      <div className="flex items-center gap-4 py-4 font-normal text-gray-900">
        {/* Notifications Dropdown */}
        <NotificationDropdown />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={`/shantwan.webp`}
              alt="Profile"
              className="w-[38px] h-[38px] rounded-[8px] cursor-pointer object-cover"
            />
            <div className="flex flex-col justify-start items-start text-left">
              <p className="text-[11px] font-normal text-black">Welcome back,</p>
              <p className="text-[11px] font-medium text-black">Shantwan Humphrey</p>
            </div>
          </button>

          {/* Profile Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[160px] bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
