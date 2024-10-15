import React from "react";
import { FiEye } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaRegClock } from "react-icons/fa6";
import { IoCheckmark } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

const DriverApprove = () => {
  return (
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto">
      <div className="grid grid-cols-2 gap-10">
        {/* Left Side: Profile and General Information */}
        <div className="space-y-6">
        <div className="bg-white rounded-[18px] p-4 pl-8 mb-6 shadow-lg flex items-center gap-6">
            {/* Profile Picture */}
            <img
              src="https://i.pravatar.cc/100?img=3"
              alt="profile"
              className="w-[100px] h-[100px] rounded-full"
            />
            {/* Profile Name */}
            <h2 className="text-[22px] font-semibold text-black mr-10">
              Mike Smith
            </h2>
            <div className="flex gap-4">
              {/* Reject Button */}
              <button className="flex items-center text-white bg-[#FF3E46] px-6 py-2 rounded-lg gap-2">
                <IoMdClose size={20} />
                <span>Reject</span>
              </button>

              {/* Approve Button */}
              <button className="flex items-center text-white bg-[#00DC67] px-6 py-2 rounded-lg gap-2">
                <IoCheckmark size={20} />
                <span>Approve</span>
              </button>
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
                { label: "MI", value: "H" },
                { label: "Suffix", value: "-Able" },
                { label: "Date of Birth", value: "24 Jan 2028" },
                { label: "SSN", value: "Lorem" },
                { label: "Driver License Number", value: "24 Jan 2028" },
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
              {[
                { label: "Social Security Front", icon: <FaFilePdf className="text-red-600 text-[40px]" /> },
                { label: "Social Security Back", icon: <FaFilePdf className="text-red-600 text-[40px]" /> },
                { label: "Driving License", icon: <FaFilePdf className="text-red-600 text-[40px]" /> },
                { label: "Registration", icon: <FaFilePdf className="text-red-600 text-[40px]" /> },
                { label: "Insurance", icon: <FaFilePdf className="text-red-600 text-[40px]" /> },


              ].map((doc, index) => (
                <div key={index} className="flex items-center gap-4 bg-[#FAFAFA] p-4 rounded-lg">
                  {doc.icon}
                  <div>
                    <p className="text-[16px] font-semibold text-black">{doc.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Driving License Section */}
          {/* <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Driving License</h3>
            <div className="flex items-center gap-4">
              <FaFilePdf className="text-red-600 text-[40px]" />
              <div>
                <p className="text-[16px] font-semibold text-black">Driving License</p>
                <p className="text-[14px] text-black">Expiry: 20/02/2028</p>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Side: Vehicle and Feedback */}
        <div className="space-y-6">
          {/* Vehicles Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Vehicles</h3>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-[#FAFAFA] rounded-lg p-4">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Vehicle"
                    className="w-full h-[100px] rounded-lg object-cover mb-4"
                  />
                  <p className="text-[16px] font-semibold text-black">Dodge Charger 2022</p>
                  <p className="text-[14px] text-black">Plate Number: JER-498</p>
                  <p className="text-[14px] text-black">Wheelchair Accessible: No</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Feedback Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Customer Feedback</h3>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="mb-4 bg-[#FAFAFA] p-4 rounded-xl">
                <div className="flex items-center gap-4 ">
                  <img
                    src="https://i.pravatar.cc/50"
                    alt="Customer"
                    className="w-[50px] h-[50px] rounded-full"
                  />
                  <div>
                    <p className="text-[16px] font-semibold text-black">Dani Mok</p>
                    <div className="flex items-center text-yellow-500">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-500 text-[14px] mt-2">
                Lorem ipsum dolor sit amet consectetur. Amet sed bibendum pellentesque diam augue malesuada.
                Lorem ipsum dolor sit amet consectetur. Amet sed bibendum pellentesque diam augue malesuada.                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverApprove;
