import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Forgot } from "../assets/export";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { RxCaretDown } from "react-icons/rx";
import { GlobalContext } from "../contexts/GlobalContext";

const Navbar = () => {
  const { navigate } = useContext(GlobalContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full h-[60px] bg-white flex justify-end items-center px-4">
      <div className="flex items-center gap-6 py-4 font-normal text-gray-900">
        <Link
          to="/notifications"
          className="w-[29px] h-[29px] rounded-lg flex items-center justify-center bg-white p-1 relative"
        >
          {/* <IoNotificationsOutline className="text-black w-full h-full" />
          <GoDotFill className="w-[20px] h-[20px] text-[#F44237] absolute -top-2 -right-2" /> */}
        </Link>

        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 relative"
        >
          {/* Image for profile link */}
          <img
            src={`/shantwan.webp`}
            alt="Profile"
            className="w-[38px] h-[38px] rounded-[8px] cursor-pointer"
            onClick={() => navigate("/profile", "Profile")}
          />
          <div className="w-auto flex flex-col justify-start items-start">
            <p className="text-[11px] font-normal leading-[17.42px] text-black">
              Welcome back,
            </p>
            <p className="text-[11px] font-medium leading-[17.64px] text-black">
              Shantwan Humphrey
            </p>
          </div>

          <button className="text-xl text-black">
            {/* <RxCaretDown /> */}
          </button>

          {/* Dropdown menu
          <div
            className={`w-[120px] h-[60px] rounded-[12px] absolute top-12 shadow-md p-3 transition-all duration-300 flex flex-col justify-start items-start gap-2 right-0 bg-[#21344C] z-[1000] ${
              isDropdownOpen ? "scale-100" : "scale-0"
            }`}
          >
            <button
              onClick={() => navigate("/profile", "Profile")}
              className="text-white text-[11px] font-medium leading-[14.85px]"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/settings/notifications", "Notifications")}
              className="text-white text-[11px] font-medium leading-[14.85px]"
            >
              Settings
            </button>
          </div> */}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
