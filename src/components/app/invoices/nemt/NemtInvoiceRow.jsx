import React, { useState } from "react";
import axios from "../../../../axios";
import { ErrorToast, SuccessToast } from "../../global/Toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FiDelete, FiEye, FiTrash } from "react-icons/fi";
import { ImSpinner10 } from "react-icons/im";
import InvoiceDeleteConfirmModal from "../../global/InvoiceDeleteConfirmModal";
import ConfirmPaidModal from "../broker/ConfirmPaidModal";

const NemtInvoiceRow = ({ invoice, setUpdate }) => {
  const navigate = useNavigate();
  const [paidLoading, setPaidLoading] = useState(false);
  const markPaid = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      setPaidLoading(true);
      const { data } = await axios.post(`/admin/invoices/admin/update/${id}`);
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
    navigate(`/invoices/nemt/${invoice?._id}`, { state: invoice }); // Pass the entire driver object as state
  };

  function convertToMMDDYYYY(dateString) {
    if (dateString == null) return "Invalid Date";
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(`/admin/invoices/admin/${id}`);
      if (response?.status == 200) {
        SuccessToast("Invoice Deleted Successfully.");
        setUpdate((prev) => !prev);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const [openMark, setOpenMark] = useState(false);

  return (
    <React.Fragment>
      <tr key={invoice._id} className=" text-[10px] text-gray-900 ">
        <td className="py-1 px-4"> #{invoice?.invoiceNo}</td>
        <td className="py-1 px-4">
          <div className="w-auto h-auto hidden lg:flex justify-start items-center gap-2">
            <span className="w-auto h-auto relative">
              <img
                src={`https://images.placeholders.dev/?width=100&height=100&text=${
                  invoice?.insurance?.name?.split(" ")[0]
                }&bgColor=%23434343&textColor=%23dfdfde`}
                className="w-10 h-10 rounded-2xl shadow-sm"
              />
            </span>
            <div className="w-auto flex flex-col justify-start items-start">
              <h3 className="text-xs font-medium ">
                {invoice?.insurance?.name}
              </h3>
              <h3 className="text-[10px] text-gray-700   font-semibold">
                {invoice?.insurance?._id}
              </h3>
            </div>
          </div>
        </td>
        <td className="py-1 px-4 text-md text-[#c00000] font-bold">
          ${invoice?.amount}
        </td>

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
        <td className="py-1 px-3">{convertToMMDDYYYY(invoice?.createdAt)}</td>
        <td className="py-1 px-3">{convertToMMDDYYYY(invoice?.completedOn)}</td>

        <td className="py-1 flex space-x-1 justify-center">
          {invoice?.status == "paid" ? (
            <>
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
            </>
          ) : (
            <>
              <button
                onClick={() => setOpenMark(true)}
                className="text-black/80 bg-[#66f06d] w-auto px-4 hover:bg-[#6afb72] h-7 flex items-center justify-center rounded-lg text-xs font-medium"
              >
                {"Mark As Cleared"}
              </button>

              <ConfirmPaidModal
                isOpen={openMark}
                onRequestClose={() => setOpenMark(false)}
                onConfirm={(e) => markPaid(e, invoice?._id)}
                loading={paidLoading}
              />

              {/* View button */}
              <div
                onClick={() => handleView(invoice)}
                className="text-white w-[26px] h-[26px] bg-[#9F9F9F]  rounded-[8px] flex items-center justify-center hover:bg-blue-600"
              >
                <FiEye className="h-4 w-5" />
              </div>
              {/* Delete button */}
              <div
                onClick={() => setOpen(true)}
                className="text-white w-[26px] h-[26px] bg-[#c00000] cursor-pointer rounded-[8px] flex items-center justify-center hover:bg-red-600"
              >
                <FiTrash className="h-4 w-5" />
              </div>

              <InvoiceDeleteConfirmModal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                onConfirm={() => handleDelete(invoice?._id)}
                loading={loading}
              />
            </>
          )}
        </td>
      </tr>
      {/* Line under each row */}
      <tr>
        <td colSpan="7" className="border-b border-gray-200"></td>
      </tr>
    </React.Fragment>
  );
};

export default NemtInvoiceRow;
