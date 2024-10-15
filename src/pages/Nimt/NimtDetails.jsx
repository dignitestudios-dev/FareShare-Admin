import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Eye icon for the view action
import { Link } from "react-router-dom";
import { IoCheckmark } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import ApproveModal from "../../components/Nimt/ApproveModal";
import RejectModal from "../../components/Nimt/RejectModal";



const NimtDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isApproveModalOpen, setApproveModalOpen] = useState(false); // For Approve Modal
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);   // For Reject Modal

  // Handlers for modal
  const openApproveModal = () => setApproveModalOpen(true);
  const closeApproveModal = () => setApproveModalOpen(false);

  const openRejectModal = () => setRejectModalOpen(true);
  const closeRejectModal = () => setRejectModalOpen(false);

  const handleApproveConfirm = () => {
    console.log("Approved");
    closeApproveModal();
  };

  const handleRejectConfirm = () => {
    console.log("Rejected");
    closeRejectModal();
  };

  return (
    <div className="w-full h-screen overflow-auto bg-[#F5F7F7] p-10  ">
      {/* Main container */}
      <div className="flex gap-10">
        {/* Left side: User Profile and General Information */}
        <div className="w-[50%]">
          {/* Profile Picture and Name Container */}
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
              <button  onClick={openRejectModal}  // Open reject modal
 className="flex items-center text-white bg-[#C00000] px-6 rounded-lg gap-2">
                <IoMdClose size={20} className="mb-1" />
                
                <span>Reject</span>
              </button>

              {/* Approve Button */}
              <button onClick={openApproveModal} className="flex items-center text-white bg-[#00DC67] px-6 py-2 rounded-lg gap-2">
                <IoCheckmark size={20} className="mb-1"  />
                <span>Approve</span>
              </button>
            </div>
          </div>

          {/* General Information Container */}
          <div className="bg-white rounded-[18px] p-7 shadow-lg">
            <h3 className="font-bold mb-4 text-black text-[24px]">
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
        </div>

        {/* Right side: Rides Taken */}
        <div className="w-[45%]">
          {/* Eligibility Verification */}
          <div className="bg-white rounded-[18px] p-6 h-[50%] shadow-lg mb-6">
            <h3 className="font-bold mb-4 text-black text-[24px]">
              Eligibility Verification
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Eligibility from date */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Eligibility from date
                </span>
                <span className="text-[16px] font-medium text-black">
                  24 Jan 2028
                </span>
              </div>

              {/* Eligibility through Date */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Eligibility through Date
                </span>
                <span className="text-[16px] font-medium text-black">
                  24 Jan 2028
                </span>
              </div>

              {/* Insurance Carrier */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Insurance Carrier
                </span>
                <span className="text-[16px] font-medium text-black">
                  Lorem Ipsum
                </span>
              </div>

              {/* Medicaid No./Insurance No. */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Medicaid No./Insurance No.
                </span>
                <span className="text-[16px] font-medium text-black">
                  489498
                </span>
              </div>

              {/* Subscriber Number */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Subscriber Number
                </span>
                <span className="text-[16px] font-medium text-black">98156</span>
              </div>

              {/* Social Security Number */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Social Security Number
                </span>
                <span className="text-[16px] font-medium text-black">156561</span>
              </div>
            </div>
          </div>

          {/* Ride Detail Section */}
          {/* Ride Detail Section */}
{/* Ride Detail Section */}
{/* <div className="bg-white rounded-[18px] p-6 h-[50%] shadow-lg">
  <div className="flex justify-between items-center">
    <h3 className="font-bold text-black text-[24px]">Ride Detail</h3>
    <span className="text-[12px] text-white bg-red-500 rounded-full p-4 font-semibold">Unpaid</span>
  </div>

  <div className="flex flex-col justify-center items-center h-full">
    <FaCircleExclamation size={108} className="text-red-500" />
    <p className="text-black text-[24px] mt-2 font-bold">no ride completed yet</p>
  </div>
</div> */}


        </div>
      </div>
       {/* Approve Modal */}
       <ApproveModal
        isOpen={isApproveModalOpen}
        onRequestClose={closeApproveModal}
        onConfirm={handleApproveConfirm}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onRequestClose={closeRejectModal}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
};

export default NimtDetails;
