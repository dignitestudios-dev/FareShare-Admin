import React from "react";
import { useLocation } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";

const DriverDetailsPage = () => {
  const location = useLocation();
  const driver = location.state; // Get the driver data from the location state

  if (!driver) {
    return <div>No driver data available.</div>; // Handle case where data is not available
  }

  return (
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto">
      <div className="grid grid-cols-2 gap-10">
        {/* Left Side: Profile and General Information */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg flex items-center gap-6">
            <img
              src={driver.profilePicture}
              alt="profile"
              className="w-[100px] h-[100px] rounded-full"
            />
            <div>
              <h2 className="text-[22px] font-semibold text-black">{`${driver.firstName} ${driver.lastName}`}</h2>
            </div>
          </div>

          {/* General Information */}
          <div className="bg-white rounded-[18px] p-6 shadow-lg">
            <h3 className="text-[24px] font-semibold mb-6 text-black">General Information</h3>
            <div className="grid grid-cols-2 gap-4 text-black">
              {[
                { label: "Full Name", value: `${driver.firstName} ${driver.lastName}` },
                { label: "Email Address", value: driver.email },
                { label: "Phone Number", value: driver.phoneNo },
                { label: "MI", value: driver.MI },
                { label: "Suffix", value: driver.suffix },
                { label: "Date of Birth", value: new Date(driver.dateOfBirth).toLocaleDateString() },
                { label: "SSN", value: driver.SSN },
                { label: "Driver License Number", value: driver.driverLicenseNumber },
                { label: "Address", value: `${driver.street}, ${driver.city}, ${driver.state}, ${driver.zipcode}` },
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
                { label: "Social Security Front", icon: driver.socialSecurityCardFront },
                { label: "Social Security Back", icon: driver.socialSecurityCardBack },
                { label: "Driving License", icon: driver.driverLicenseCardFront },
                { label: "Registration", icon: driver.driverLicenseCardBack },
                { label: "Insurance", icon: "insurance-doc-link" }, // Replace with actual link if available
              ].map((doc, index) => (
                <div key={index} className="flex items-center gap-4 bg-[#FAFAFA] p-4 rounded-lg">
                  <FaFilePdf className="text-red-600 text-[40px]" />
                  <div>
                    <p className="text-[16px] font-semibold text-black">{doc.label}</p>
                    {doc.icon !== "insurance-doc-link" ? (
                      <a className="text-blue-500 cursor-pointer" href={doc.icon} target="_blank" rel="noopener noreferrer">
                        View Document
                      </a>
                    ) : (
                      <span className="text-black" >No Document</span>
                    )}
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
              {Array.from({ length: driver.vehicleCount }).map((_, index) => (
                <div key={index} className="bg-[#FAFAFA] rounded-lg p-4">
                  <img
                    src="https://via.placeholder.com/150" // Replace with actual vehicle image if available
                    alt="Vehicle"
                    className="w-full h-[100px] rounded-lg object-cover mb-4"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[16px] font-semibold text-black">Vehicle Brand</p> {/* Replace with actual data */}
                      <p className="text-[14px] text-gray-500">Vehicle Model</p> {/* Replace with actual data */}
                    </div>
                    <p className="text-[16px] font-medium text-black">Year</p> {/* Replace with actual data */}
                  </div>
                  <div className="mt-2">
                    <p className="text-[14px] text-gray-500">Plate Number:</p>
                    <p className="text-[16px] font-medium text-black">Plate Number</p> {/* Replace with actual data */}
                  </div>
                  <hr className="my-2" />
                  <p className="text-[14px] text-black">Wheelchair Accessible: <span>NO</span></p>
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
                    <p className="text-[16px] font-semibold text-black">Customer Name</p> {/* Replace with actual data */}
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
