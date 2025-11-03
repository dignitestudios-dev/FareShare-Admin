import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import { IoNotificationsOutline } from "react-icons/io5";

const Navbar = () => {
  const { navigate, handleLogout } = useContext(GlobalContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full h-[60px] bg-gray-50 border-b flex justify-end items-center px-4">
      <div className="flex items-center gap-6 py-4 font-normal text-gray-900">
        {/* Notifications */}
        <Link
          to="/notifications"
          className="w-[32px] h-[32px] group rounded-lg transition-all duration-300 flex items-center justify-center bg-gray-200 hover:bg-[#c00000] p-1 relative"
        >
          <IoNotificationsOutline className="text-gray-700 group-hover:text-white text-xs w-full h-full" />
        </Link>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <img
              src={`/shantwan.webp`}
              alt="Profile"
              className="w-[38px] h-[38px] rounded-[8px] cursor-pointer"
            />
            <div className="flex flex-col justify-start items-start">
              <p className="text-[11px] font-normal text-black">Welcome back,</p>
              <p className="text-[11px] font-medium text-black">Shantwan Humphrey</p>
            </div>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[160px] bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
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
