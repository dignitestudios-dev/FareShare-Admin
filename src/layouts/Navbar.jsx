import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import { IoNotificationsOutline } from "react-icons/io5";

const Navbar = () => {
  const { navigate } = useContext(GlobalContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full h-[60px] bg-gray-50 border-b flex justify-end items-center px-4">
      <div className="flex items-center gap-6 py-4 font-normal text-gray-900">
        <Link
          to="/notifications"
          className="w-[32px] h-[32px] group  rounded-lg transition-all duration-300 flex items-center justify-center bg-gray-200 hover:bg-[#c00000]  p-1 relative"
        >
          <IoNotificationsOutline className="text-gray-700 group-hover:text-white  text-xs w-full h-full" />
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
        </button>
      </div>
    </div>
  );
};

export default Navbar;
