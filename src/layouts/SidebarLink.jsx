import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const SidebarLink = ({ link, onCloseDrawer }) => {
  const { navigate } = useContext(GlobalContext);
  const location = useLocation();

  // Parent active
  const isParentActive = location.pathname === link.url;

  // Submenu active
  const isSubActive = link.submenu?.some(
    (item) => item.url === location.pathname
  );

  // Parent active ho ya submenu active ho
  const isActive = isParentActive || isSubActive;

  const [isOpen, setIsOpen] = useState(isActive);

  // Browser Back/Forward ya refresh par submenu automatically open ho
  useEffect(() => {
    if (isSubActive) {
      setIsOpen(true);
    }
  }, [isSubActive]);

  const toggleSubmenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavigation = (url, title) => {
    navigate(url, title);
    onCloseDrawer();
  };

  const handleSubNavigation = (url, title) => {
    navigate(url, title);
    onCloseDrawer();
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full group relative flex items-center">
        <button
          onClick={
            link.submenu
              ? toggleSubmenu
              : () => handleNavigation(link.url, link.title)
          }
          className={`w-full h-[43px] rounded-full px-3 flex items-center justify-between transition-all duration-300
            ${isActive
              ? "bg-[#c00000] text-white"
              : "text-black/40 hover:bg-[#c00000] hover:text-white"
            }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-xl ${isActive
                  ? "text-white"
                  : "text-[#c00000] group-hover:text-white"
                }`}
            >
              {link.icon}
            </span>

            <span className="text-[13px] font-bold capitalize">
              {link.title}
            </span>
          </div>

          {link.submenu && (
            <span>{isOpen ? <FaCaretUp /> : <FaCaretDown />}</span>
          )}
        </button>

        {isActive && (
          <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-[10px] h-[18px] rounded-r-full bg-[#c00000]" />
        )}
      </div>

      {link.submenu && isOpen && (
        <div className="ml-8 mt-2 flex flex-col gap-2">
          {link.submenu.map((sublink, index) => {
            const isSubLinkActive =
              location.pathname === sublink.url;

            return (
              <button
                key={index}
                onClick={() =>
                  handleSubNavigation(sublink.url, sublink.title)
                }
                className={`text-left px-3 py-1 rounded-lg transition-all
                  ${isSubLinkActive
                    ? "text-[#c00000] font-semibold"
                    : "text-black/40 hover:text-[#c00000]"
                  }`}
              >
                <span className="text-[13px]">{sublink.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarLink;