import React, { useContext, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const SidebarLink = ({ link, onCloseDrawer }) => {
  const { navigate, activeLink } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (url, title) => {
    navigate(url, title);
    onCloseDrawer();
  };

  return (
    <div className="w-full relative">
      <button
        onClick={
          link.submenu
            ? toggleSubmenu
            : () => handleNavigation(link?.url, link?.title)
        }
        className={`w-full h-[46px] outline-none rounded-[12px] 
        ${
          activeLink === link?.title
            ? "bg-white text-black relative"
            : "bg-transparent text-gray-600"
        } 
        font-medium flex items-center justify-between transition-all duration-500  px-3 gap-2`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl hover:text-white">{link?.icon}</span>
          <span className="capitalize text-[13px] font-medium ">
            {link?.title}
          </span>
        </div>
        {link.submenu && (
          <span className="text-sm">
            {isOpen ? <FaCaretUp /> : <FaCaretDown />}
          </span>
        )}
      </button>

      {/* Red semicircle for the active link */}
      {activeLink === link?.title && (
        <span className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-red-600"></span>
      )}

      {link.submenu && isOpen && (
        <div className="ml-8 mt-2 flex flex-col justify-start items-start gap-2">
          {link.submenu.map((sublink, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(sublink.url, sublink.title)}
              className={` w-full outline-none rounded-[12px] 
              bg-transparent text-white/50 hover:text-[#199BD1]
              font-medium flex items-center justify-start transition-all duration-500 px-3 gap-2`}
            >
              <span className="capitalize text-[13px] font-medium">
                {sublink.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarLink;
