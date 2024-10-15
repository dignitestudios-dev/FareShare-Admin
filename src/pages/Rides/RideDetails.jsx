import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md"; // Location icons
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon
import { FaRegClock } from "react-icons/fa6";
import { FaCcMastercard } from "react-icons/fa";

const RideDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto ">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: Ride Details */}
        <div className="bg-white h-[65%] rounded-[18px] p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[22px] font-semibold text-black">Ride Detail</h3>
            <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full">Ongoing</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-[17px] text-black font-semibold">ID Number</p>
            <p className="text-[17px] text-black font-semibold">8904600966</p>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="profile"
              className="w-[40px] h-[40px] rounded-full"
            />
            <div>
              <h2 className="text-[16px] font-semibold text-black">Dani Mok</h2>
              <p className="text-[14px] text-gray-500">danimok@gmail.com</p>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex items-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-red-500 mb-3 w-[8px] h-[8px] rounded-full"></div>
              <div className="bg-gray-300 w-[6px] h-[6px] rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-[14px] text-gray-500">Start Location</p>
              <p className="text-black font-semibold">User Start Location</p>
            </div>
          </div>

          {/* End Location */}
          <div className="flex items-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-gray-300 mb-3 w-[6px] h-[6px] rounded-full"></div>
              <div className="bg-red-500 w-[8px] h-[8px] rounded-full"></div>
            </div>
            <div className="ml-4">
              <p className="text-[14px] text-gray-500">End Location</p>
              <p className="text-black font-semibold">User End Location</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <AiOutlineCalendar className="text-red-500" />
              <p className="text-black font-semibold">Wed, Nov 10</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaRegClock className="text-red-500" />
              <p className="text-black font-semibold">5:30 pm</p>
            </div>
          </div>

          {/* Fare Info */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-[17px] text-black font-semibold">Fare</p>
            <p className="text-[17px] font-medium text-red-500 font-semibold">$50</p>
          </div>

          {/* Card Details */}
          <div className="mt-4 p-4 rounded-lg flex items-center justify-between border border-gray-400">
            <div className="flex items-center">
              <FaCcMastercard className="text-red-500 mr-2 w-7 h-7" />
              <p className="text-[16px] font-medium text-black">**** **** **** 678</p>

            </div>
          </div>
        </div>

        {/* Right Side: Driver Profile & Vehicle Info */}
        <div className="space-y-6">
          {/* Driver Info */}
          <div className="flex items-center justify-between bg-white rounded-[18px] p-6 shadow-lg">
  <div className="flex items-center">
    <img
      src="https://i.pravatar.cc/100?img=5"
      alt="profile"
      className="w-[70px] h-[70px] rounded-full"
    />
    <div className="ml-4">
      <h2 className="text-[18px] font-semibold text-black">Mike Smith</h2>
      <p className="text-[16px] text-black">mikesmith12@gmail.com</p>
    </div>
  </div>
  <div>
    <h3 className="text-[14px] font-semibold text-[#A2A2A2]">Medical</h3>
  </div>
</div>


          {/* Vehicle Detail */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[22px] font-semibold mb-6 text-black">Vehicle Details</h3>
            <img
              src="https://via.placeholder.com/300"
              alt="Vehicle"
              className="w-full h-[200px] rounded-lg object-cover mb-4"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAFAFA] rounded-lg p-2">
                <p className="text-[14px] text-black">Make</p>
                <p className="text-[16px] font-medium text-black">Dodge</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg p-2">
                <p className="text-[14px] text-black">Name</p>
                <p className="text-[16px] font-medium text-black">Charger</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg p-2">
                <p className="text-[14px] text-black">Model Year</p>
                <p className="text-[16px] font-medium text-black">2022</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg p-2">
                <p className="text-[14px] text-black">Plate Number</p>
                <p className="text-[16px] font-medium text-black">JER-498</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg p-2">
                <p className="text-[14px] text-black">Wheelchair Accessible</p>
                <p className="text-[16px] font-medium text-black">No</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
