import React from 'react';
import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { GrDocumentPdf } from "react-icons/gr";
import { IoPrintOutline } from "react-icons/io5";
import { BsFiletypePdf } from "react-icons/bs";

const InvoiceModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-gray-700 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-black"
          onClick={onRequestClose}
        >
          <IoMdClose size={24} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-red-500 text-2xl font-bold">FareShare</div>
          <div className="text-black text-2xl font-semibold">Invoice</div>
        </div>

        {/* Client Details */}
        <div className="mb-4">
          <p className="text-gray-500 text-sm">Invoice to</p>
          <p className="text-lg font-bold inline">your client name</p>
          <div className="inline float-right text-sm">
            <p>Invoice: 0021</p>
            <p>Date: 30/12/2020</p>
            <p>Due Date: 30/12/2020</p>
          </div>
          <p className="text-xs">your client email address or post address</p>
          <p className="mt-2 text-xs">
            <strong>Name:</strong> John Doe
          </p>
          <p className="text-xs">Pickup Location: *Address*</p>
          <p className="text-xs">Drop off Location: *Address*</p>
        </div>

        {/* Ride Description Table */}
        <table className="w-full mb-4 text-left text-xs">
          <thead>
            <tr>
              <th className="border-b py-1">Ride Description</th>
              <th className="border-b py-1 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 border-b">Base Rate (*Vehicle Type*)</td>
              <td className="py-1 text-right border-b">$50.00</td>
            </tr>
            <tr>
              <td className="py-1 border-b">Additional Mileage Fees</td>
              <td className="py-1 text-right border-b">$50.00</td>
            </tr>
            <tr>
              <td className="py-1 border-b">Wait Time Fees</td>
              <td className="py-1 text-right border-b">$50.00</td>
            </tr>
            <tr>
              <td className="py-1 border-b">Additional Attendant Fees</td>
              <td className="py-1 text-right border-b">$50.00</td>
            </tr>
          </tbody>
        </table>

        {/* Payment Method & Summary */}
        <div className="mb-4 text-xs">
          <p className="flex justify-between">
            <strong>Payment Method</strong>
            <strong className="text-right">Subtotal</strong>
          </p>
          <p>Stripe: 984619846156</p>
          <p>PayPal: 661981616185</p>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-4 text-xs">
          <div className="text-right">
            <p>Subtotal: $250.00</p>
            <p>Tax: Vat(15%): $250.00</p>
            <p className="font-bold bg-[#E6E6E6] p-2 rounded-md">Total Due: $250.00</p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mb-4 text-xs">
          <p className="text-gray-500">
            <strong>Terms & Conditions / Notes</strong><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center text-xs mb-4 space-x-20">
          <div className="flex flex-col items-center mx-4">
            <button className="text-red-600 hover:text-red-800">
              <IoPrintOutline size={20} className='mb-2 ml-6' />
              <span className='text-black'>Print Invoice</span>
            </button>
          </div>
          <div className="flex flex-col items-center mx-4">
            <button className="text-red-600 hover:text-gray-900">
              <BsFiletypePdf size={20} className='mb-2 ml-8' />
              <span className='text-black text-center'>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
