import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const InvoiceModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  loading,
  invoiceData,
  count,
}) => {
  const navigate = useNavigate();
  const navigateToInvoice = () => {
    invoiceData &&
      navigate(`/invoices/nemt/${invoiceData?._id}`, { state: invoiceData });
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center z-[1000] backdrop-blur-sm"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[1000]  flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded-[20px] shadow-lg max-w-lg w-[552px] min-h-[289px] text-center">
        <div className="flex justify-center mb-4">
          <img src="/info-icon.png" alt="" />
        </div>
        {invoiceData == null ? (
          <h2 className=" font-bold mb-1 leading-[32px] text-[24px]">
            Generate Invoice
          </h2>
        ) : (
          <h2 className=" font-bold mb-1 leading-[32px] text-[24px]">
            Invoice Generated
          </h2>
        )}

        {invoiceData == null ? (
          <p className="text-[#252525] text-[16px] font-normal leading-[25.34px] mb-6">
            Are you sure you want to generate invoice <br /> for ({count})
            selected rides ?
          </p>
        ) : (
          <p className="text-[#252525] text-[16px] font-normal leading-[25.34px] mb-6">
            View complete invoice by clicking on the view invoice button.
          </p>
        )}
        {invoiceData == null ? (
          <div className="flex justify-center space-x-4">
            <button
              disabled={loading}
              onClick={onRequestClose}
              className="px-6 flex items-center justify-center border-2 border-red-500 text-[13px] font-bold  w-[238px] h-[48px] text-red-500  rounded-full hover:bg-red-100 transition"
            >
              No
            </button>
            <button
              disabled={loading}
              onClick={onConfirm}
              className="px-6 flex items-center justify-center bg-[#C00000] w-[238px] h-[48px] text-white  rounded-full hover:bg-red-600 transition text-[13px] font-bold "
            >
              {loading ? (
                <div
                  class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                  role="status"
                  aria-label="loading"
                >
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                <span>Yes</span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/invoices/nemt")}
              className="px-6 flex items-center justify-center border-2 border-red-500 text-[13px] font-bold  w-[238px] h-[48px] text-red-500  rounded-full hover:bg-red-100 transition"
            >
              Close
            </button>
            <button
              onClick={navigateToInvoice}
              className="px-6 flex items-center justify-center bg-[#C00000] w-[238px] h-[48px] text-white  rounded-full hover:bg-red-600 transition text-[13px] font-bold "
            >
              <span>View Invoice</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InvoiceModal;
