import React, { useState, useContext } from "react";
import { Logo } from "../assets/export";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutCircleLine, RiMenuLine } from "react-icons/ri";
import { AuthMockup } from "../assets/export";
import { IoNotificationsOutline } from "react-icons/io5";
import { GoDotFill } from "react-icons/go";
import { GlobalContext } from "../contexts/GlobalContext";

const OnboardLayout = ({ page }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { navigate } = useContext(GlobalContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };
  return (
    <div className="w-full h-screen overflow-y-hidden flex justify-start items-start">
      <div>
        {/* Drawer Toggle Button */}
        <button
          onClick={toggleDrawer}
          className="lg:hidden fixed top-4 left-4 z-50 text-white"
        >
          <RiMenuLine size={24} />
        </button>

        {/* Sidebar Container */}
        <div
          className={`fixed lg:static top-0 left-0 w-[280px] bg-[#001229] py-4 px-6 flex flex-col justify-start items-start transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 z-40 h-screen overflow-y-auto`}
        >
          <Link to="/">
            <img src={Logo} alt="perfectboat_logo" className="h-[74px]" />
          </Link>
        </div>

        {/* Overlay when drawer is open */}
        {isDrawerOpen && (
          <div
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
          ></div>
        )}
      </div>
      <div className="w-full lg:w-[calc(100%-280px)]  h-full relative flex flex-col justify-start items-start">
        <div className="w-full h-[60px] bg-[#001229] flex justify-end items-center px-4"></div>
        <div className="w-full h-[calc(100%-60px)] bg-[#1A293D] text-white   flex flex-col justify-start items-start">
          {page}
        </div>
      </div>
    </div>
  );
};

export default OnboardLayout;