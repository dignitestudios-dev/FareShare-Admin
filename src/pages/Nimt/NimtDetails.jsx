import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Eye icon for the view action
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoCheckmark } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosInformationCircle } from "react-icons/io";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import ApproveModal from "../../components/Nimt/ApproveModal";
import RejectModal from "../../components/Nimt/RejectModal";
import { ErrorToast, SuccessToast } from "../../components/global/Toast";
import axios from "../../axios";
import Cookies from "js-cookie";

const NimtDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const nemt = location?.state;
  const navigate = useNavigate();
  const [isApproveModalOpen, setApproveModalOpen] = useState(false); // For Approve Modal
  const [isRejectModalOpen, setRejectModalOpen] = useState(false); // For Reject Modal

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

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const [open, setOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const [closeOpen, setCloseOpen] = useState(false);

  const toggleAccept = async () => {
    try {
      setAcceptLoading(true);
      const { data } = await axios.post("/admin/approveUser", {
        userId: JSON.parse(Cookies?.get("nemt"))?.userId?._id,
        isApproved: true,
      });
      if (data?.success) {
        setOpen(false);
        navigate("/nemt");
        SuccessToast("NEMT Approved Successfully.");
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const toggleDecline = async () => {
    try {
      setDeclineLoading(true);

      const { data } = await axios.post("/admin/approveUser", {
        userId: JSON.parse(Cookies?.get("nemt"))?.userId?._id,
        isApproved: false,
        reason:
          "Your NEMT request was rejected as it did not meet FareShare Compliance",
      });
      if (data?.success) {
        setCloseOpen(false);
        navigate("/nemt");
        SuccessToast("NEMT Rejected Successfully.");
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeclineLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-auto bg-[#F5F7F7] p-10  ">
      {/* Main container */}
      <div className="flex gap-10">
        {/* Left side: User Profile and General Information */}
        <div className="w-[50%]">
          {/* Profile Picture and Name Container */}
          <div className="bg-white rounded-[18px] p-4 pl-8 mb-6 shadow-lg flex items-center gap-4">
            {/* Profile Picture */}
            <img
              src={nemt?.userId?.profilePicture}
              alt="profile"
              className="w-[70px] h-[70px] rounded-full"
            />
            {/* Profile Name */}
            <h2 className="text-[18px] font-semibold text-black ">
              {nemt?.userId?.firstName} {nemt?.userId?.lastName}
            </h2>
            {nemt?.status !== "approved" && (
              <div className="flex gap-2 ml-auto">
                {/* Reject Button */}
                <button
                  onClick={() => setCloseOpen(true)}
                  className=" text-white bg-[#FF3E46] w-[120px] h-[37px] flex items-center justify-center  rounded-[8px] gap-1 "
                >
                  <IoMdClose className="text-[20px] mb-0.5" />
                  <span className="text-[14px] font-normal leading-none">
                    Reject
                  </span>
                </button>

                {/* Approve Button */}
                <button
                  onClick={() => setOpen(true)}
                  className=" text-white bg-[#00DC67] w-[120px] h-[37px] flex items-center justify-center  rounded-[8px] gap-1 "
                >
                  <IoCheckmark className="text-[20px] mb-0.5" />
                  <span className="text-[14px] font-normal leading-none">
                    Approve
                  </span>
                </button>
              </div>
            )}
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
                  {nemt?.userId?.firstName} {nemt?.userId?.lastName}
                </span>
              </div>

              {/* Email Address */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Email Address
                </span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.userId?.email}
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Phone Number</span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.userId?.phoneNo}
                </span>
              </div>

              {/* MI */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">MI</span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.userId?.MI}
                </span>
              </div>

              {/* Suffix */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Suffix</span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.userId?.suffix}
                </span>
              </div>

              {/* Gender */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Gender</span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.userId?.gender}
                </span>
              </div>

              {/* Patient Date of Birth */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Patient date of birth
                </span>
                <span className="text-[16px] font-medium text-black">
                  {convertToMMDDYYYY(nemt?.userId?.patientDateofBirth)}
                </span>
              </div>

              {/* Patient Date of Death */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Patient date of Death
                </span>
                <span className="text-[16px] font-medium text-black">
                  {convertToMMDDYYYY(nemt?.userId?.patientDateofDeath)}
                </span>
              </div>

              {/* Address */}
              <div className="col-span-2 flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Address</span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.userId?.street}
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
                  {convertToMMDDYYYY(nemt?.eligiblityFormDate)}
                </span>
              </div>

              {/* Eligibility through Date */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Eligibility through Date
                </span>
                <span className="text-[16px] font-medium text-black">
                  {convertToMMDDYYYY(nemt?.eligiblityThroughDate)}
                </span>
              </div>

              {/* Insurance Carrier */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Insurance Carrier
                </span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.insuranceCarrier}
                </span>
              </div>

              {/* Medicaid No./Insurance No. */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Medicaid No./Insurance No.
                </span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.insuranceNumber}
                </span>
              </div>

              {/* Subscriber Number */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Subscriber Number
                </span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.subscriberNumber}
                </span>
              </div>

              {/* Social Security Number */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Social Security Number
                </span>
                <span className="text-[16px] font-medium text-black">
                  {nemt?.socialSecurityNumber}
                </span>
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
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        onConfirm={() => toggleAccept()}
        loading={acceptLoading}
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={closeOpen}
        onRequestClose={() => setCloseOpen(false)}
        onConfirm={() => toggleDecline()}
        loading={declineLoading}
      />
    </div>
  );
};

export default NimtDetails;
