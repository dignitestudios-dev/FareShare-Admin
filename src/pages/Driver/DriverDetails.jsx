import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md"; // Location icons
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon
import { FaRegClock } from "react-icons/fa6";


const DriverDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto">
      <div className="grid grid-cols-2 gap-10">
        {/* Left Side: Driver Profile and General Information */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="profile"
              className="w-[100px] h-[100px] rounded-full"
            />
            <div>
              <h2 className="text-[22px] font-semibold text-black">Dani Mok</h2>
            </div>
          </div>

          {/* General Information */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">General Information</h3>
            <div className="grid grid-cols-2 gap-4 text-black">
              {[
                { label: "Full Name", value: "Mike Smith" },
                { label: "Email Address", value: "mikesmith12@gmail.com" },
                { label: "Phone Number", value: "+1 856 558 0215" },
                { label: "Date of Birth", value: "24 Jan 1990" },
                { label: "Date of License Expiry", value: "24 Jan 2028" },
                { label: "Address", value: "6740 South Service Drive, MI, U.S.A." },
              ].map((info, index) => (
                <div key={index} className="bg-[#FAFAFA] p-4 rounded-lg">
                  <span className="text-[14px] text-black">{info.label}</span>
                  <span className="text-[16px] font-medium block">{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {["Driving License", "Insurance", "Registration"].map((doc, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg">
                  <FaFilePdf className="text-red-600 text-[40px]" />
                  <div>
                    <p className="text-[16px] font-semibold text-black">{doc}</p>
                    <p className="text-[14px] text-black">Expiry: 30/12/2028</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Ride Details and Vehicle Info */}
        <div className="space-y-6">
          {/* Ride Detail */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Ride Detail</h3>

            <div className="flex justify-between items-center mb-4">
              <p className="text-[14px] text-black font-semibold">ID Number</p>
              <p className="text-[14px] text-black">8904600966</p>
            </div>

            {/* Location Info */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-2">
                <MdLocationOn className="text-red-600" />
                <p className="text-black font-semibold">6740 South Service Drive, MI, U.S.A.</p>
              </div>
              <div className="flex items-center space-x-2">
                <MdLocationOn className="text-green-600" />
                <p className="text-black font-semibold">1234 North Main St, Chicago, IL</p>
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
            <div className="mt-4">
              <p className="text-[14px] text-black font-semibold">Fare</p>
              <p className="text-[16px] font-medium text-red-500">$50</p>
            </div>

 {/* Card Details */}
 <div className="mt-4 bg-[#FAFAFA] p-4 rounded-lg">
              <p className="text-[14px] text-black font-semibold">Card Details</p>
              <p className="text-[16px] font-medium text-black">**** **** **** 1234</p>
            </div>
            {/* Review Section */}
            <div className="mt-4 bg-[#F7F8FA] p-3 rounded-lg">
              <p className="text-[14px] text-black font-semibold">Review</p>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">★★★★★</span>
                <p className="text-black font-medium">Excellent Service</p>
              </div>
              <p className="text-gray-500 text-sm">
                Lorem ipsum dolor sit amet consectetur. Amet sed bibendum pellentesque...
              </p>
            </div>

           
          </div>

          {/* Vehicle Detail */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Vehicle Details</h3>
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
                <p className="text-[14px] text-black">Model</p>
                <p className="text-[16px] font-medium text-black">Charger</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg p-2">
                <p className="text-[14px] text-black">Year</p>
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

export default DriverDetails;
