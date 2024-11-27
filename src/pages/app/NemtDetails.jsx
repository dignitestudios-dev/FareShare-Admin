import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import axios from "../../axios";
import Cookies from "js-cookie";
import ApproveModal from "../../components/app/nimt/ApproveModal";
import RejectModal from "../../components/app/nimt/RejectModal";

const NemtDetails = () => {
  const location = useLocation();
  const nemt = location?.state;
  const navigate = useNavigate();
  const { id } = useParams();

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

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-4">
      <div className="w-full h-auto bg-gray-50 border rounded-3xl p-4 flex flex-col justify-start items-start ">
        <div className="w-full flex items-center  mb-4 justify-between h-8 ">
          <h3 className="font-semibold text-black text-[24px]">
            General Information
          </h3>
          <div className="w-auto flex justify-start items-center gap-1">
            {nemt?.status.toLowerCase() !== "approved" && (
              <>
                <button
                  onClick={() => setCloseOpen(true)}
                  className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#c00000] text-white"
                >
                  {"Decline"}
                </button>
                <button
                  onClick={() => setOpen(true)}
                  className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
                >
                  {"Approve"}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-full grid grid-cols-4 justify-start items-start gap-4">
          <div className="w-full h-[198px] rounded-xl bg-gray-100 border  p-2">
            <img
              src={nemt?.userId?.profilePicture}
              alt=""
              className="w-full h-full aspect-square object-contain rounded-lg"
            />
          </div>
          <div className="w-full col-span-3 grid grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Full Name</span>
              <span className="text-[13px] font-medium text-black">{`${nemt?.userId?.firstName} ${nemt?.userId?.lastName}`}</span>
            </div>

            {/* Email Address */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Email Address</span>
              <span className="text-[13px] font-medium text-black">
                {nemt?.userId?.email}
              </span>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Phone Number</span>
              <span className="text-[13px] font-medium text-black">
                {nemt?.userId?.phoneNo}
              </span>
            </div>

            {/* MI */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">MI</span>
              <span className="text-[13px] font-medium text-black">
                {nemt?.userId?.MI || "N/A"}
              </span>
            </div>

            {/* Suffix */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Suffix</span>
              <span className="text-[13px] font-medium text-black">
                {nemt?.userId?.suffix || "N/A"}
              </span>
            </div>

            {/* Gender */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Gender</span>
              <span className="text-[13px] font-medium text-black">
                {nemt?.userId?.gender}
              </span>
            </div>

            {/* Patient Date of Birth */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">
                Patient Date of Birth
              </span>
              <span className="text-[13px] font-medium text-black">
                {nemt?.userId?.patientDateofBirth
                  ? new Date(
                      nemt?.userId?.patientDateofBirth
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>

            {/* Address */}
            <div className="col-span-2 flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Address</span>
              <span className="text-[13px] font-medium text-black">
                {`${nemt?.userId?.street}, ${nemt?.userId?.city}, ${nemt?.userId?.state}, ${nemt?.userId?.postalCode}, U.S.A.`}
              </span>
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
      </div>
      <div className="w-full bg-gray-50  rounded-3xl border p-6 h-auto  mb-6">
        <h3 className="font-bold mb-4 text-black text-[24px]">
          Eligibility Verification
        </h3>
        <div className="w-full grid grid-cols-3 gap-6">
          {/* Eligibility from date */}
          <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
            <span className="text-[14px] text-[#9E9E9E]">
              Eligibility from date
            </span>
            <span className="text-[16px] font-medium text-black">
              {convertToMMDDYYYY(nemt?.eligiblityFormDate)}
            </span>
          </div>

          {/* Eligibility through Date */}
          <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
            <span className="text-[14px] text-[#9E9E9E]">
              Eligibility through Date
            </span>
            <span className="text-[16px] font-medium text-black">
              {convertToMMDDYYYY(nemt?.eligiblityThroughDate)}
            </span>
          </div>

          {/* Insurance Carrier */}
          <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
            <span className="text-[14px] text-[#9E9E9E]">
              Insurance Carrier
            </span>
            <span className="text-[16px] font-medium text-black">
              {nemt?.insuranceCarrier}
            </span>
          </div>

          {/* Medicaid No./Insurance No. */}
          <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
            <span className="text-[14px] text-[#9E9E9E]">
              Medicaid No./Insurance No.
            </span>
            <span className="text-[16px] font-medium text-black">
              {nemt?.insuranceNumber}
            </span>
          </div>

          {/* Subscriber Number */}
          <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
            <span className="text-[14px] text-[#9E9E9E]">
              Subscriber Number
            </span>
            <span className="text-[16px] font-medium text-black">
              {nemt?.subscriberNumber}
            </span>
          </div>

          {/* Social Security Number */}
          <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
            <span className="text-[14px] text-[#9E9E9E]">
              Social Security Number
            </span>
            <span className="text-[16px] font-medium text-black">
              {nemt?.socialSecurityNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NemtDetails;
