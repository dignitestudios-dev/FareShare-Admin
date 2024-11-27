import React, { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoKeyOutline } from "react-icons/io5";
import { RiProfileLine } from "react-icons/ri";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";


const SettingsLayout = ({ page }) => {
  const { navigate, activeLink } = useContext(GlobalContext);
  return (
    <div className="h-full overflow-y-auto w-full p-2 lg:p-6 flex flex-col gap-6 justify-start items-start">
      <div className="w-full h-[83vh] bg-[#001229] text-white rounded-[18px] flex justify-start items-start">
        <div className="w-[360px] h-full flex flex-col gap-5 justify-start items-start py-10 px-8">
          <button
            onClick={() => navigate("/profile", "Profile")}
            className={`w-auto text-lg font-medium ${
              activeLink == "Profile" ? "text-[#028EE6]" : "text-white/50"
            }  hover:text-[#028EE6]  focus-within:text-[#028EE6] flex justify-start items-center gap-2 `}
          >
            <FaRegUserCircle />
            <span className="text-sm">Profile</span>
          </button>
          <button
            onClick={() =>
              navigate("/settings/change-password", "Change Password")
            }
            className={`w-auto text-lg font-medium ${
              activeLink == "Change Password"
                ? "text-[#028EE6]"
                : "text-white/50"
            }  hover:text-[#028EE6] focus-within:text-[#028EE6] flex justify-start items-center gap-2 `}
          >
            <IoKeyOutline />
            <span className="text-sm">Change Password</span>
          </button>
          <button
            onClick={() => navigate("/settings/notifications", "Notifications")}
            className={`w-auto text-xl ${
              activeLink == "Notifications" ? "text-[#028EE6]" : "text-white/50"
            } font-medium  hover:text-[#028EE6] focus-within:text-[#028EE6] flex justify-start items-center gap-2 `}
          >
            <IoIosNotificationsOutline />
            <span className="text-sm">Notifications</span>
          </button>
          <button
            onClick={() =>
              navigate("/Settings/Billing", "Billing")
            }
            className={`w-auto text-lg font-medium ${
              activeLink == "Billing"
                ? "text-[#028EE6]"
                : "text-white/50"
            }  hover:text-[#028EE6] focus-within:text-[#028EE6] flex justify-start items-center gap-2 `}
          >
<LiaFileInvoiceDollarSolid />
<span className="text-sm">Billing</span>
          </button>
        </div>
        <span className="h-full w-[1px] bg-white/10 rounded-full"></span>
        <div className="w-[calc(100%-360px)]  h-full  py-5 px-2">
          <div className="flex flex-col overflow-y-auto px-4 justify-start items-start w-full h-full">
            {page}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;