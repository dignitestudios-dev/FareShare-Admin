import React, { useState } from "react";
import axios from "../../../../axios";
import { ErrorToast, SuccessToast } from "../../global/Toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FiEye } from "react-icons/fi";
import ConfirmPaidModal from "./ConfirmPaidModal";

const BrokerInvoiceRow = ({ invoice, setUpdate }) => {
  const navigate = useNavigate();
  const [paidLoading, setPaidLoading] = useState(false);
  const markPaid = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      setPaidLoading(true);
      const { data } = await axios.post(`/finance/rideInvoice/${id}`);
      SuccessToast("Invoice marked as paid.");
      setUpdate((prev) => !prev); // Ensure we set an empty array if no data
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

  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <tr key={invoice._id} className=" text-[10px] text-gray-900 ">
        <td className=" gap-3 py-1">
          {/* {invoice?.userId && (
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
          )} */}
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
        </td>
        <td className="py-1 px-4">
          {" "}
          {convertToMMDDYYYY(invoice?.creationDate)}
        </td>
        <td className="py-1 px-4">{convertToMMDDYYYY(invoice?.dueDate)}</td>
        <td className="py-1 px-4">
          <span className={`py-1 px-2 capitalize  `}>
            {invoice?.status == "unpaid" ? (
              <span className="text-[#f73e3e] border border-[#f73e3e] bg-[#f73e3e]/[0.1]  px-2 py-1 rounded-full">
                Uncleared
              </span>
            ) : (
              <span className="text-[#7aba26] border border-[#7aba26]  bg-[#7aba26]/[0.1]  px-2 py-1 rounded-full">
                Cleared
              </span>
            )}
          </span>
        </td>
        <td className="py-1 flex space-x-1 justify-center">
          {invoice?.status == "paid" ? (
            <button
              onClick={() => handleView(invoice)}
              className="    rounded-[8px] justify-center bg-[#c00000] flex  h-[25px] gap-1 w-[75px]  items-center"
            >
              <img
                src={`/eye-icon-white.png`}
                alt={invoice?.dueDate}
                className="mb-[0.2px]"
              />
              <span className=" text-white font-medium text-[10px] leading-none">
                View
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setOpen(true)}
                className="text-black/80 bg-[#66f06d] w-auto px-4 hover:bg-[#6afb72] h-7 flex items-center justify-center rounded-lg text-xs font-medium"
              >
                {"Mark As Cleared"}
              </button>
              <ConfirmPaidModal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                onConfirm={(e) => markPaid(e, invoice?.id)}
                loading={paidLoading}
              />
              {/* View button */}
              <div
                onClick={() => handleView(invoice)}
                className="text-white w-[26px] h-[26px] bg-[#9F9F9F]  rounded-[8px] flex items-center justify-center hover:bg-blue-600"
              >
                <FiEye className="h-4 w-5" />
              </div>
            </>
          )}
        </td>
      </tr>
      {/* Line under each row */}
      <tr>
        <td colSpan="6" className="border-b border-gray-200"></td>
      </tr>
    </React.Fragment>
  );
};

export default BrokerInvoiceRow;
