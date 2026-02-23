import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import Cookies from "js-cookie";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import BrokerPlatformRides from "../../components/app/broker/BrokerPlatformRides";
import BrokerNonPlatformRides from "../../components/app/broker/BrokerNonPlatformRides";
import BrokerInvoices from "../../components/app/broker/BrokerInvoices";
import BlockModal from "../../components/app/global/BlockModal";

const BrokerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brokerData, setBrokerData] = useState([]); // Updated variable name to camelCase
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const getBrokerDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/admin/broker/${id}`);
      setBrokerData(data?.data); // Store the actual data from the response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const toggleBlock = async (isBlocked) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/block", {
        brokerId: id,
        isBlocked: isBlocked,
      });
      if (data?.success) {
        setLoading(false);
        setOpen(false);
        navigate("/brokers");
        SuccessToast(
          isBlocked
            ? "User blocked Successfully."
            : "User Unblocked Successfully."
        );
        getBrokerDetails();
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBrokerDetails();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-4">
      <div className="w-full h-auto bg-gray-50 border rounded-3xl p-4 flex flex-col justify-start items-start ">
        <div className="w-full flex items-center  mb-4 justify-between h-8 ">
          <h3 className="font-semibold text-black text-[24px]">
            General Information
          </h3>
          {brokerData?.broker?.isBlocked ? (
            <button
              onClick={() => {
                setOpen(true);
                setIsBlocked(false);
              }}
              className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#6eff49] text-black"
            >
              {"Unblock"}
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(true);
                setIsBlocked(true);
              }}
              className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
            >
              {"Block"}
            </button>
          )}
        </div>
        <div className="w-full grid grid-cols-4 justify-start items-start gap-4">
          <div className="w-full col-span-4 grid grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Company Name</span>
              <span className="text-[13px] font-medium text-black">{`${brokerData?.broker?.companyName} `}</span>
            </div>
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">
                Account Handler Name
              </span>
              <span className="text-[13px] font-medium text-black">{`${brokerData?.broker?.accountHandlerName} `}</span>
            </div>

            {/* Email Address */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Email Address</span>
              <span className="text-[13px] font-medium text-black">
                {brokerData?.broker?.email}
              </span>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">
                Tax Identification
              </span>
              <span className="text-[13px] font-medium text-black">
                {brokerData?.broker?.companyTaxIdenfication}
              </span>
            </div>

            {/* MI */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Department</span>
              <span className="text-[13px] font-medium text-black">
                {brokerData?.broker?.department || "N/A"}
              </span>
            </div>
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">
                Is Bank Verified
              </span>
              <span className="text-[13px] font-medium text-black">
                {brokerData?.broker?.isBankVerified ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex flex-col bg-gray-100 border p-3 rounded-xl w-36">
              <span className="text-[12px] text-[#9E9E9E]">Card</span>
              <span className="text-[13px] font-medium text-black">
                {brokerData?.broker?.cardBrand
                  ? `${brokerData.broker.cardBrand} •••• ${brokerData.broker.cardLast4}`
                  : "No card available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <BrokerPlatformRides broker={brokerData} loading={loading} />
      <BrokerNonPlatformRides broker={brokerData} loading={loading} />
      <BrokerInvoices broker={brokerData} loading={loading} />
      <BlockModal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        onConfirm={() => toggleBlock(isBlocked)}
        loading={loading}
        isBlocked={isBlocked}
      />
    </div>
  );
};

export default BrokerDetails;
