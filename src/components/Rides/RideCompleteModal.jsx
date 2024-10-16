import React from 'react';
import Modal from 'react-modal';
import { IoMdClose } from 'react-icons/io';
import { FaExclamation } from "react-icons/fa";


const RideComplete = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-[552px] h-[289px] text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-[#C00000] p-4">
            <FaExclamation className="text-white text-4xl" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-[24px]">Complete Ride</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to complete this ride?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onRequestClose}
            className="px-6 py-2 border-2 border-red-500  w-[238px] h-[48px] text-red-500 font-semibold rounded-full hover:bg-red-100 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-[#C00000] w-[238px] h-[48px] text-white font-semibold rounded-full hover:bg-red-600 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RideComplete;
