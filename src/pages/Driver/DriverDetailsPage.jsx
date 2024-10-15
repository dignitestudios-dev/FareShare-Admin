import React from "react";
import { FiEye } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaRegClock } from "react-icons/fa6";

const DriverDetailsPage = () => {
  return (
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto">
      <div className="grid grid-cols-2 gap-10">
        {/* Left Side: Profile and General Information */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="profile"
              className="w-[100px] h-[100px] rounded-full"
            />
            <div>
              <h2 className="text-[22px] font-semibold text-black">Mike Smith</h2>
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
        </div>

        {/* Right Side: Vehicle and Feedback */}
        <div className="space-y-6">
          {/* Vehicles Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Vehicles</h3>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-[#FAFAFA] rounded-lg p-4">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Vehicle"
                    className="w-full h-[100px] rounded-lg object-cover mb-4"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                    <p className="text-[16px] font-semibold text-black">Dodge</p>

                      <p className="text-[14px] text-gray-500">Charger</p>
                    </div>
                    <p className="text-[16px] font-medium text-black">2022</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-[14px] text-gray-500">Plate Number:</p>
                    <p className="text-[16px] font-medium text-black">JER-498</p>
                  </div>
                  <hr className="my-2" />
                  <p className="text-[14px] text-black">Wheelchair Accessible: <span>NO</span></p>
                  {/* <p className="text-[16px] font-medium text-black">No</p> */}
                </div>
              ))}
            </div>
          </div>

          {/* Customer Feedback Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">Customer Feedback</h3>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="mb-4 bg-[#FAFAFA] p-4 rounded-xl">
                <div className="flex items-center gap-4">
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
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsPage;
