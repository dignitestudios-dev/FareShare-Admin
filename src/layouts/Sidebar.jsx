import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../assets/export";
import { sidebarArr } from "../constants/SidebarArr";
import SidebarLink from "./SidebarLink";
import { RiLogoutCircleLine, RiMenuLine } from "react-icons/ri";
import Cookies from "js-cookie";
import { LiaFileInvoiceSolid } from "react-icons/lia";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div>
      {/* Drawer Toggle Button */}
      <button
        onClick={toggleDrawer}
        className="lg:hidden fixed top-4 left-4 z-50 text-black"
      >
        <RiMenuLine size={24} />
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed lg:static top-0 left-0 w-[280px] border-r bg-gray-50 py-4 px-6 flex flex-col justify-start items-start transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40 h-screen overflow-y-auto`}
      >
        <Link to="/home" className="">
          <img src={Logo} alt="fareshare-logo" className=" " />
        </Link>

        <div className="w-full mt-6 flex flex-col justify-start items-start gap-1 text-red-500 flex-grow">
          {sidebarArr?.map((link, index) => (
            <SidebarLink
              key={index}
              link={link}
              onCloseDrawer={handleCloseDrawer}
            />
          ))}
        </div>

        {/* Logout button at the bottom */}
        <button
          onClick={() => {
            navigate("/", "Home");
            Cookies.remove("token");
            handleCloseDrawer();
          }}
          className={`w-full h-[46px] outline-none rounded-[12px] 
            bg-transparent text-black 
            font-medium flex items-center justify-start transition-all duration-500 
             hover:text-white px-3 gap-2 mt-auto`}
        >
          <span className="text-xl mb-1">
            <RiLogoutCircleLine className=" text-[#C00000]" />
          </span>
          <span className="capitalize bg-transparent text-black/40 font-bold text-[13px] ">
            Logout
          </span>
        </button>
      </div>

      {/* Overlay when drawer is open */}
      {isDrawerOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-30"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
