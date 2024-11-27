import React, { useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { MdCheck, MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../../axios";
import RejectModal from "./RejectModal";
import ApproveModal from "./ApproveModal";
import { ErrorToast, SuccessToast } from "../global/Toast";

const NimtTable = ({ data, loading, setUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("");

  // Filter data based on search query and active tab
  const filteredData = data.filter((item) => {
    const matchesSearch = item.insuranceCarrier
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "" || item.status.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const navigate = useNavigate();

  const handleView = (nemt) => {
    Cookies.set("nemt", JSON.stringify(nemt));
    navigate(`/nemt/${nemt?._id}`, { state: nemt });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-200 text-green-800";
      case "Unpaid":
        return "bg-red-200 text-red-800";
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "approved":
        return "bg-green-200 text-black";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "";
    }
  };

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
        setUpdate((prev) => !prev);
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
        setUpdate((prev) => !prev);
        SuccessToast("NEMT Rejected Successfully.");
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeclineLoading(false);
    }
  };

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="w-full h-auto ">
      {/* Header Section */}
      <div className="flex justify-between px-1 items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          NEMT{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        <div className="w-auto flex justify-end items-center gap-2">
          <div className="relative  bg-transparent">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="border rounded-2xl bg-gray-50 pl-4 pr-10 py-3 text-sm text-gray-700 focus:outline-none w-[400px]"
            />
            <FiSearch className="absolute top-1/2 bg-transparent right-3 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* Tab Section */}
          <div className="w-80 h-11 bg-gray-50 grid grid-cols-3 gap-1 items-center justify-start border p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab("");
                setCurrentPage(1);
              }}
              className={`w-full transition-all duration-300 ${
                activeTab == ""
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }  h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              All
            </button>
            <button
              onClick={() => {
                setActiveTab("pending");
                setCurrentPage(1);
              }}
              className={`w-full transition-all duration-300 ${
                activeTab == "pending"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }  h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Pending
            </button>
            <button
              onClick={() => {
                setActiveTab("approved");
                setCurrentPage(1);
              }}
              className={`w-full  transition-all duration-300 ${
                activeTab == "approved"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }   h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Approved
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-gray-50 border px-5 py-4 rounded-[18px] ">
        <table className="min-w-full  border-separate rounded-[18px]">
          <thead>
            <tr className=" text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
              <th className="py-2 ">Insurance Carrier</th>
              <th className="py-2 px-4">Insurance Number</th>
              <th className="py-2 px-4">Subscriber Number</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4 flex justify-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(10)].map((_, index) => (
                  <React.Fragment key={index}>
                    <tr className=" text-[10px] text-gray-900">
                      <td className="py-1">
                        <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="bg-gray-300 w-[75px] h-[26px] rounded-[8px] flex items-center justify-center"></div>
                      </td>
                    </tr>
                    {/* Line under each row */}
                    <tr>
                      <td colSpan="5" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              : currentData?.map((item, key) => (
                  <React.Fragment key={key}>
                    <tr key={item._id} className=" text-[10px] text-gray-900 ">
                      <td className="py-1 ">{item?.insuranceCarrier}</td>
                      <td className="py-1 px-4">{item?.insuranceNumber}</td>
                      <td className="py-1 px-4">{item?.subscriberNumber}</td>
                      <td className="py-1 px-4">
                        <span
                          className={`py-1 px-2 capitalize rounded-full ${getStatusClass(
                            item?.status
                          )}`}
                        >
                          {item?.status}
                        </span>
                      </td>
                      <td className="py-1 flex space-x-1 justify-center">
                        {item?.status == "approved" ? (
                          <button
                            onClick={() => handleView(item)}
                            className="    rounded-[8px] justify-center bg-[#c00000] flex  h-[25px] gap-1 w-[75px]  items-center"
                          >
                            <img
                              src={`/eye-icon-white.png`}
                              alt={item?.insuranceNumber}
                              className="mb-[0.2px]"
                            />
                            <span className=" text-white font-medium text-[10px] leading-none">
                              View
                            </span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setCloseOpen(true);
                                Cookies.set("nemt", JSON.stringify(item));
                              }}
                              className="bg-red-500 text-white w-[26px] h-[26px] flex items-center justify-center  rounded-[8px] hover:bg-red-600"
                            >
                              <MdClose className="w-5 h-5" />
                            </button>
                            {/* Approve button */}
                            <button
                              onClick={() => {
                                setOpen(true);
                                Cookies.set("nemt", JSON.stringify(item));
                              }}
                              className="bg-green-500 text-white w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-green-600"
                            >
                              <MdCheck className="w-5 h-5" />
                            </button>
                            {/* View button */}
                            <div
                              onClick={() => handleView(item)}
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
                ))}
          </tbody>
        </table>

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

      <nav
        class="flex items-center  justify-end mt-2 -space-x-px"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={() =>
            goToPage(currentPage > 1 ? currentPage - 1 : currentPage)
          }
          class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
          aria-label="Previous"
        >
          <svg
            class="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span class="hidden sm:block">Previous</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => goToPage(i + 1)}
            class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${
              currentPage === i + 1
                ? " border bg-[#c00000] text-white hover:bg-[#c00000] "
                : "border bg-gray-50"
            }    py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-none  disabled:opacity-50 disabled:pointer-events-none `}
            aria-current="page"
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            goToPage(currentPage < totalPages ? currentPage + 1 : currentPage)
          }
          class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
          aria-label="Next"
        >
          <span class="hidden sm:block">Next</span>
          <svg
            class="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default NimtTable;
