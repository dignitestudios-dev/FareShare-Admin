import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md"; // Location icons
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon
import { FaRegClock } from "react-icons/fa6";

const BrokerDetails = () => {
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
          {/* <div className="bg-white rounded-[18px] p-6 shadow-lg">
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
          </div> */}

          <div className="bg-white rounded-[18px] p-7 shadow-lg">
            <h3 className="font-semibold mb-4 text-black text-[24px]">
              General Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Full Name</span>
                <span className="text-[16px] font-medium text-black">
                  Mike Smith
                </span>
              </div>

              {/* Email Address */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Email Address
                </span>
                <span className="text-[16px] font-medium text-black">
                  mikesmith12@gmail.com
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Phone Number</span>
                <span className="text-[16px] font-medium text-black">
                  +1 856 558 0215
                </span>
              </div>

              {/* MI */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">MI</span>
                <span className="text-[16px] font-medium text-black">H</span>
              </div>

              {/* Suffix */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Suffix</span>
                <span className="text-[16px] font-medium text-black">
                  -Able
                </span>
              </div>

              {/* Gender */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Gender</span>
                <span className="text-[16px] font-medium text-black">Male</span>
              </div>

              {/* Patient Date of Birth */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Patient date of birth
                </span>
                <span className="text-[16px] font-medium text-black">
                  24 Jan 1990
                </span>
              </div>

              {/* Patient Date of Death */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Patient date of Death
                </span>
                <span className="text-[16px] font-medium text-black">
                  24 Jan 2028
                </span>
              </div>

              {/* Address */}
              <div className="col-span-2 flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Address</span>
                <span className="text-[16px] font-medium text-black">
                  6740 South Service Drive Waterford Township, MI, 327, U.S.A.
                </span>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {/* <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {["Driving License", "Insurance", "Registration"].map((doc, index) => (
                <div key={index} className="flex items-center gap-4 bg-[#FAFAFA] p-4 rounded-lg">
                  <FaFilePdf className="text-red-600 text-[40px]" />
                  <div>
                    <p className="text-[16px] font-semibold text-black">{doc}</p>
                    <p className="text-[14px] text-black">Expiry: 30/12/2028</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Side: Ride Details and Vehicle Info */}
        <div className="space-y-6">
          {/* Ride Detail */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[24px] font-bold text-black">Ride Detail</h3>
              <span className="bg-red-100 font-semibold text-red-500 px-3 py-1 rounded-full">
                Pending
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-[17px] text-black font-semibold">ID Number</p>
              <p className="text-[17px] text-black font-semibold">8904600966</p>
            </div>

            {/* Location Info */}
            {/* Start Location */}
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
                <p className="text-[14px] text-gray-500 mt-4">End Location</p>
                <p className="text-black font-semibold">User End Location</p>
              </div>
            </div>

            {/* Fare Info */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <p className="text-black text-[17px] font-semibold">Fare:</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-[#C00000] text-[17px]  font-semibold">
                  $100
                </p>
              </div>
            </div>

            {/* Card Details */}
            {/* <div className="mt-4 bg-[#FAFAFA] p-4 rounded-lg">
              <p className="text-[14px] text-black font-semibold">
                Card Details
              </p>
              <p className="text-[16px] font-medium text-black">
                **** **** **** 1234
              </p>
            </div> */}
            {/* Review Section */}
            {/* <div className="mt-4 bg-[#F7F8FA] p-3 rounded-lg">
              <p className="text-[14px] text-black font-semibold">Review</p>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500">★★★★★</span>
                <p className="text-black font-medium">Excellent Service</p>
              </div>
              <p className="text-gray-500 text-sm">
                Lorem ipsum dolor sit amet consectetur. Amet sed bibendum
                pellentesque...
              </p>
            </div> */}
          </div>

          {/* Vehicle Detail */}
          {/* <div className="bg-white rounded-[18px] p-6 shadow-lg">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BrokerDetails;
