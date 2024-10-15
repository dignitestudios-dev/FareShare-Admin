import React from "react";
import { FaRegUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaCar } from "react-icons/fa6";



const DashboardStats = () => {
  return (
    <div className="w-full lg:w-[70%] grid grid-cols-2 lg:grid-cols-5 justify-start items-start gap-2 lg:gap-[280px]">
      <div className="w-full lg:w-[240px] h-[100px] rounded-[24px] bg-white p-[12px] flex gap-2 items-center justify-start">
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E9FAFF] text-[#35CFFF] text-2xl flex items-center justify-center">
          <FaRegUser />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">500+</span>
          <span className="text-black text-[14px] font-normal">
            Total Users
          </span>
        </div>
      </div>
      <div className="w-full lg:w-[240px] h-[100px] rounded-[24px] bg-white p-[12px] flex gap-2 items-center justify-start">
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E9FAFF] text-[#1FBA46] text-3xl flex items-center justify-center">
        <FaRegUser />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">300+</span>
          <span className="text-black text-[14px] font-normal">
            Total Rider
          </span>
        </div>
      </div>
      <div className="w-full lg:w-[240px] h-[100px] rounded-[24px] bg-white p-[12px] flex gap-2 items-center justify-start">
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#FFF5E1] text-[#FFBB39] text-3xl flex items-center justify-center">
        <FaRegUser />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">450+</span>
          <span className="text-black text-[14px] font-normal">
          Total Broker
          </span>
        </div>
      </div>
      <div className="w-full lg:w-[240px] h-[100px] rounded-[24px] bg-white p-[12px] flex gap-2 items-center justify-start">
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#C0000033] text-[#C00000] text-3xl flex items-center justify-center">
          <PiUsersThreeBold />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">4</span>
          <span className="text-black text-[14px] font-normal">
            NIMT Request
          </span>
        </div>
      </div>
      <div className="w-full lg:w-[240px] h-[100px] rounded-[24px] bg-white p-[12px] flex gap-2 items-center justify-start">
        <span className="w-[64px] h-[64px] rounded-[18px] bg-[#0074B633] text-[#0041A4] text-3xl flex items-center justify-center">
          <FaCar />
        </span>
        <div className="w-auto flex flex-col justify-start items-start">
          <span className="text-[18px] font-bold text-black">4</span>
          <span className="text-black text-[14px] font-normal">
            Vehicle Request
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;