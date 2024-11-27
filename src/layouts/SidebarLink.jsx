import React, { useContext, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const SidebarLink = ({ link, onCloseDrawer }) => {
  const { navigate, activeLink } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubmenu = () => {
    localStorage.setItem("title", "Invoices");
    setIsOpen((prev) => !prev);
  };

  const handleNavigation = (url, title) => {
    localStorage.setItem("sub-title", title);

    navigate(url, title);
    localStorage.setItem("title", title);
    onCloseDrawer();
  };

  const handleSubNavigation = (url, title) => {
    navigate(url, title);
    localStorage.setItem("sub-title", title);
    onCloseDrawer();
  };

  return (
    <div className="w-full flex flex-col justify-start items-start">
      <div className="w-full group flex items-center relative">
        <button
          onClick={
            link.submenu
              ? toggleSubmenu
              : () => handleNavigation(link?.url, link?.title)
          }
          className={`w-full  h-[46px] outline-none rounded-full
        ${
          localStorage.getItem("title") === link?.title
            ? "bg-[#c00000] text-white  relative"
            : "bg-transparent group-hover:bg-[#c00000] group-hover:text-white text-black/40"
        } 
        font-medium flex items-center justify-between transition-all duration-500  px-3 gap-2`}
        >
          <div className="flex items-center h-10  gap-2">
            <span
              className={`text-xl mb-1  ${
                localStorage.getItem("title") === link?.title
                  ? " text-white relative"
                  : " text-[#c00000] group-hover:text-white group-hover:relative"
              }  `}
            >
              {link?.icon}
            </span>
            <span className="capitalize text-[13px]  leading-none font-bold ">
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
        {localStorage.getItem("title") === link?.title && (
          <span className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-[10px] h-[18px] rounded-r-full bg-[#c00000]"></span>
        )}
        <span className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-[10px] h-[18px] hidden  transition-all duration-500 group-hover:flex rounded-r-full group-hover:bg-[#c00000] bg-transparent"></span>
      </div>

      {link.submenu && isOpen && (
        <div className="ml-8 mt-2 flex flex-col justify-start items-start gap-2">
          {link.submenu.map((sublink, index) => (
            <button
              key={index}
              onClick={() => handleSubNavigation(sublink.url, sublink.title)}
              className={` w-full outline-none rounded-[12px] 
              bg-transparent  hover:text-[#c00000]   ${
                localStorage.getItem("sub-title") === sublink?.title
                  ? "text-[#c00000]"
                  : "text-black/40"
              }
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
