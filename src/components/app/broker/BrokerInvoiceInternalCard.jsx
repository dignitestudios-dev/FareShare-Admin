import React, { useState } from "react";
import axios from "../../../axios";
import { ErrorToast, SuccessToast } from "../../app/global/Toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const BrokerInvoiceInternalCard = ({ invoice }) => {
  const navigate = useNavigate();
  const [paidLoading, setPaidLoading] = useState(false);
  const markPaid = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      setPaidLoading(true);
      const { data } = await axios.post(`/finance/rideInvoice/${id}`);
      SuccessToast("Invoice marked as paid.");
      navigate("/invoices/broker");
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setPaidLoading(false);
    }
  };

  const handleView = (invoice) => {
    Cookies.set("invoice", JSON.stringify(invoice));
    navigate(`/invoices/broker/${invoice?._id}`, { state: invoice }); // Pass the entire driver object as state
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
    <div className="w-full h-[13rem] relative rounded-3xl  bg-gray-50 cursor-pointer transition-all duration-300 group  border p-4 flex flex-col justify-start items-start">
      <div className="w-full h-auto flex justify-between items-center">
        {invoice?.userId && (
          <div className="w-auto h-auto hidden lg:flex justify-start items-center gap-2">
            <span className="w-auto h-auto relative">
              <img
                src={invoice?.userId?.profilePicture}
                className="w-10 h-10 rounded-2xl shadow-sm"
              />
            </span>
            <div className="w-auto flex flex-col justify-start items-start">
              <h3 className="text-sm font-semibold ">
                {invoice?.userId?.firstName} {invoice?.userId?.lastName}
              </h3>
              <h3 className="text-xs text-gray-700   font-semibold">
                {invoice?.userId?.email}
              </h3>
            </div>
          </div>
        )}
        {invoice?.brokerId && (
          <div className="w-auto h-auto hidden lg:flex justify-start items-center gap-2">
            <span className="w-auto h-auto relative">
              <img
                src={`https://craftypixels.com/placeholder-image/50x50/c00000/fff&text=${invoice?.brokerId?.accountHandlerName?.slice(
                  0,
                  1
                )}`}
                className="w-10 h-10 rounded-2xl shadow-sm"
              />
            </span>
            <div className="w-auto flex flex-col justify-start items-start">
              <h3 className="text-sm font-semibold ">
                {invoice?.brokerId?.accountHandlerName}{" "}
              </h3>
              <h3 className="text-xs text-gray-700   font-semibold">
                {invoice?.brokerId?.email}
              </h3>
            </div>
          </div>
        )}

        <div className="w-auto flex flex-col gap-[4px] justify-start items-end ">
          <div className="w-auto text-xs font-bold text-gray-700  flex gap-1 justify-start items-center">
            {invoice?.status == "unpaid" ? (
              <span className="text-[#f73e3e] border border-[#f73e3e] bg-[#f73e3e]/[0.1]  px-2 py-1 rounded-full">
                Uncleared
              </span>
            ) : (
              <span className="text-[#7aba26] border border-[#7aba26]  bg-[#7aba26]/[0.1]  px-2 py-1 rounded-full">
                Cleared
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-auto flex my-6 justify-between items-center">
        <div className="w-full grid grid-cols-2 justify-between items-center ">
          <div className="w-full text-xs font-bold text-gray-700  flex gap-1 justify-start items-center">
            <span>Generated On: </span>
            <span className="text-[#c00000] ">
              {convertToMMDDYYYY(invoice?.creationDate)}
            </span>
          </div>
          <div className="w-full text-xs font-bold text-gray-700  flex gap-1 justify-end items-center">
            <span>Due Date: </span>
            <span className="text-[#c00000] ">
              {convertToMMDDYYYY(invoice?.dueDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-auto flex justify-end items-center">
        <div className="w-auto text-md font-bold text-gray-700  flex gap-1 justify-start items-center">
          <span>Total Amount: </span>
          <span className="text-[#c00000]  text-lg">${invoice?.amount}</span>
        </div>
      </div>

      <div className="w-full h-10 absolute   bottom-0 px-3 left-0 grid grid-cols-2 gap-2 justify-end items-center">
        {invoice?.status == "unpaid" ? (
          <button
            onClick={(e) => markPaid(e, invoice?.id)}
            disabled={paidLoading}
            className="text-black/80 bg-[#66f06d] w-full px-4 hover:bg-[#6afb72] h-8 flex items-center justify-center rounded-full text-xs font-medium"
          >
            {paidLoading ? "Loading.." : "Mark As Cleared"}
          </button>
        ) : (
          <span className="text-white bg-[#171817] w-full px-4  h-8 flex items-center justify-center rounded-full text-xs font-medium">
            {" "}
            Paid on:
            <span className=" w-auto px-2 h-6 flex items-center justify-center rounded-full text-xs font-medium">
              {convertToMMDDYYYY(invoice?.completionDate)}
            </span>
          </span>
        )}
        <button
          onClick={() => handleView(invoice)}
          className="text-gray-700 bg-gray-200 w-full px-4 hover:bg-[#717171] hover:text-white h-8 flex items-center justify-center rounded-full text-xs font-medium"
        >
          View Invoice
        </button>
      </div>
    </div>
  );
};

export default BrokerInvoiceInternalCard;
