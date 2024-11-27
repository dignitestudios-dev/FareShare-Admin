import React, { useState } from "react";
import { BsReplyAll } from "react-icons/bs";
import { GoIssueClosed } from "react-icons/go";
import axios from "../../../axios";
import { ErrorToast } from "../global/Toast";
import MarkTicketModal from "./MarkTicketModal";
const TicketCard = ({ ticket, number, setUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const markTicketClosed = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(`/admin/contacts/${id}`);
      if (response?.status == 200) {
        setUpdate((prev) => !prev);
        setOpen(false);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative h-auto flex flex-col gap-2 justify-start items-start bg-gray-100 border p-4 rounded-2xl">
      {ticket?.isClosed ? (
        <span className="w-auto h-8 px-2 border absolute top-2 right-2 border-green-500/40  rounded-lg flex items-center justify-center text-xs text-green-500 bg-green-500/10 ">
          Closed
        </span>
      ) : (
        <span className="w-auto h-8 px-2 border absolute top-2 right-2 border-red-500/40  rounded-lg flex items-center justify-center text-xs text-red-500 bg-red-500/10 ">
          Open
        </span>
      )}

      <div className="w-full  border-b pb-4 h-auto flex flex-col gap-[4px] justify-start items-start">
        <div className="w-auto flex mb-3 justify-start items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-pink-500/20"></span>
          <h1 className="text-2xl font-bold text-black">
            Ticket #{number + 1}
          </h1>
        </div>

        <span className="text-[#2E2C34] text-[14px] font-medium">
          {ticket?.subject}
        </span>
        <span className="text-[#84818A] text-[12px] font-medium">
          {ticket?.description}
        </span>
      </div>

      <div className="w-full h-10 flex justify-between items-end">
        <div className="w-auto flex justify-start items-center gap-3">
          <img
            src={`https://craftypixels.com/placeholder-image/50x50/c00000/fff&text=${ticket?.name?.slice(
              0,
              1
            )}`}
            alt=""
            className="w-8 h-8 rounded-full"
          />
          <div className="w-auto flex flex-col justify-center items-start">
            <span className="text-sm font-medium text-[#262626]">
              {ticket?.name}
            </span>
            <span className="text-xs font-medium text-[#262626]">
              {ticket?.email}
            </span>
          </div>
        </div>

        <div className="flex gap-1 justify-start items-end">
          <a
            href={`mailto:${ticket?.email}`}
            className="w-auto  px-2 h-7 bg-[#c00000]  text-[#fff] rounded-lg font-medium  flex items-center justify-center gap-2"
          >
            <BsReplyAll className="text-lg" />
            <span className="text-sm">Reply</span>
          </a>
          {!ticket?.isClosed && (
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="w-auto  px-2 h-7 bg-[#9ff643]  text-[#000] rounded-lg font-medium  flex items-center justify-center gap-2"
            >
              <GoIssueClosed className="text-lg" />
              <span className="text-sm">
                {loading ? "Loading..." : "Mark As Closed"}
              </span>
            </button>
          )}

          <MarkTicketModal
            isOpen={open}
            onRequestClose={() => setOpen(false)}
            onConfirm={() => markTicketClosed(ticket?.id)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
