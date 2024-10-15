import React, { useState } from "react";

import { MdLocationOn } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaRegClock } from "react-icons/fa6";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa"; // For checkboxes
import InvoiceModal from "../../components/Broker/InvoiceModal";


const NimtUnpaid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto  ">
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
            <h3 className="text-[24px] font-semibold mb-6 text-black">Eligibility Verification</h3>
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

          {/* Vehicle Details Section */}
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

        {/* Right Side: Ride Details */}
        <div className="space-y-6">
          {/* Ride Detail */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[24px] font-semibold text-black">Ride Detail</h3>
              <p className="text-[14px] text-red-500 bg-[#FDEDED] px-3 py-1 rounded-full">Unpaid</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-[14px] text-black font-semibold">ID Number</p>
              <p className="text-[14px] text-black">8904600966</p>
            </div>

            {/* Ride entries section */}
            {[1, 2].map((entry, index) => (
              <div key={index} className="border-b border-gray-300 pb-4 mb-4 space-y-4">
                {/* User Profile */}
                <div className="flex items-center space-x-4">
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

                {/* Start Location */}
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
  <p className="ml-auto text-[14px] text-gray-500">Wed, Nov 10, 5:30 pm</p>
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
  <p className="ml-auto text-[14px] text-gray-500">Wed, Nov 10, 6:30 pm</p>
</div>


                {/* Fare Info */}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-[17px] font-bold text-black">Fare : <span  className=" text-[17px] text-red-500">$50</span></p>
                  <div className="flex items-center space-x-2">
                    <p className="text-[14px] text-gray-500">Payment Received</p>
                    <input
                      type="checkbox"
                      className="form-checkbox text-green-500 h-5 w-5"
                      defaultChecked={true}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Review Section */}
            <div className="mt-4">
              <h4 className="text-[16px] font-semibold mb-2 text-black">Review</h4>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 text-[30px]">★★★★★</span>
              </div>
              <p className="text-[14px] text-black px-2">
              Lorem ipsum dolor sit amet consectetur. Amet sed bibendum pellentesque diam augue malesuada. Leo tempus tristique nisi placerat ullamcorper pellentesque. Metus eu amet sit congue dignissim et etiam sodales. Gravida enim faucibus nullam.              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 space-x-10">
  <button onClick={openModal} className="bg-[#C00000] text-white font-semibold rounded-full w-[499px] h-[48px] py-2">
  Invoice
  </button>
  {/* <button className="bg-[#E4E4E4] text-[#868686] font-semibold rounded-full px-20 py-4">
    Mark as Paid
  </button> */}
</div>


          </div>
        </div>
      </div>
      {/* Invoice Modal */}
      <InvoiceModal isOpen={isModalOpen} onRequestClose={closeModal} />

    </div>
  );
};

export default NimtUnpaid;
