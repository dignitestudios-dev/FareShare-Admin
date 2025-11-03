import React, { useContext } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaCar } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { MdCommute } from "react-icons/md";

const DashboardStats = ({ stats, loading }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="w-full grid grid-cols-2 lg:grid-cols-5 justify-start items-start gap-2 lg:gap-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-full h-[88px] rounded-[24px] bg-gray-200 border animate-pulse p-[12px] flex gap-2 items-center justify-start"
          >
            <span className="w-[64px] h-[64px] rounded-[18px] bg-gray-300 flex items-center justify-center">
              {/* Placeholder for icon */}
            </span>
            <div className="w-auto flex flex-col justify-start items-start">
              <span className="w-[40%] h-[20px] bg-gray-300 rounded mb-2"></span>
              <span className="w-[60%] h-[16px] bg-gray-300 rounded"></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full  grid grid-cols-2 lg:grid-cols-5 justify-start items-start gap-2 lg:gap-6 ">
      <button
        onClick={() => {
          navigate("/users", "Users");
          localStorage.setItem("title", "Users");
        }}
        className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start"
      >
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E9FAFF] text-[#35CFFF] text-2xl flex items-center justify-center">
          <FaRegUser />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">
            {stats?.userCount || 0}
          </span>
          <span className="text-black text-[14px] font-normal">
            Total Users
          </span>
        </div>
      </button>

      <button
        onClick={() => {
          navigate("/drivers", "Drivers");
          localStorage.setItem("title", "Drivers");
        }}
        className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start"
      >
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E9FAFF] text-[#1FBA46] text-3xl flex items-center justify-center">
          <FiUser />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">
            {stats?.driverCount || 0}
          </span>
          <span className="text-black text-[14px] font-normal">
            Total Drivers
          </span>
        </div>
      </button>

      <button
        onClick={() => {
          navigate("/brokers", "Brokers");
          localStorage.setItem("title", "Brokers");
        }}
        className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start"
      >
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#FFF5E1] text-[#FFBB39] text-3xl flex items-center justify-center">
          <PiUsersThreeBold />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">
            {stats?.brokerCount || 0}
          </span>
          <span className="text-black text-[14px] font-normal">
            Total Brokers
          </span>
        </div>
      </button>

      <button
        onClick={() => {
          navigate("/nemt", "NEMT Approval");
          localStorage.setItem("title", "NEMT Approval");
        }}
        className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start"
      >
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#C0000033] text-[#C00000] text-3xl flex items-center justify-center">
          <PiUsersThreeBold />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">
            {stats?.nemtCount || 0}
          </span>
          <span className="text-black text-[14px] font-normal">
            NEMT Requests
          </span>
        </div>
      </button>

      <button
        onClick={() => {
          navigate("/vehicle-approval", "Vehicle Approval");
          localStorage.setItem("title", "Vehicle Approval");
        }}
        className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start"
      >
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#0074B633] text-[#0041A4] text-3xl flex items-center justify-center">
          <FaCar />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">
            {stats?.vehicleCount || 0}
          </span>
          <span className="text-black text-[14px] font-normal">
            Vehicle Requests
          </span>
        </div>
      </button>
      <button
        onClick={() => {
          navigate("/rides", {
            state: { inProgressSelected: "InProgress" },
          });
          localStorage.setItem("title", "Rides Inprogress");
        }}
        className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start"
      >
        <span className="w-[64px] h-[64px] rounded-[18px] bg-blue-100 text-blue-400 text-3xl flex items-center justify-center">
          <MdCommute />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">
            {stats?.activeRidesCount || 0}
          </span>
          <span className="text-black text-[14px] font-normal">
            Total Rides
          </span>
        </div>
      </button>
    </div>
  );
};

export default DashboardStats;
