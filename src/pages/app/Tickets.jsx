import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoIosPin } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LuCopyPlus } from "react-icons/lu";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import { BsReplyAll } from "react-icons/bs";
import { GoIssueClosed } from "react-icons/go";
import TicketCard from "../../components/app/tickets/TicketCard";

const Tickets = () => {
  const [date, setDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [activeTab, setActiveTab] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setSearch(searchQuery);
    }, 400);
  }, [searchQuery]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  const getTickets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/contacts");
      setData(data?.data || []); // Ensure we set an empty array if no data
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
  }, [update]);

  const filteredData = data?.filter((ticket) => {
    if (!ticket) return false; // Skip null or undefined tickets.

    const lowerCaseSearch = search?.toLowerCase() || "";
    const lowerCaseTab = activeTab?.toLowerCase().trim(); // Normalize tab input.

    // Determine tab value
    const tab =
      lowerCaseTab === ""
        ? null
        : lowerCaseTab === "closed"
        ? true
        : lowerCaseTab === "open"
        ? false
        : null;

    // Debugging: Check tab and ticket.isClosed values

    // Match logic
    const matchesSearch =
      ticket?.name?.toLowerCase()?.includes(lowerCaseSearch) ||
      ticket?.email?.toLowerCase()?.includes(lowerCaseSearch);

    const matchesTab = tab === null || tab === ticket?.isClosed;

    return matchesSearch && matchesTab;
  });

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
    <div className="h-auto w-full flex flex-col gap-2 justify-start items-start ">
      <div className="w-full flex px-1 justify-between items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Tickets{" "}
          <span className="text-[16px] text-gray-500">
            ({filteredData?.length})
          </span>
        </h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2">
          {/* Search Input */}
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
                setActiveTab("closed");
                setCurrentPage(1);
              }}
              className={`w-full transition-all duration-300 ${
                activeTab == "closed"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }  h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Closed
            </button>
            <button
              onClick={() => {
                setActiveTab("open");
                setCurrentPage(1);
              }}
              className={`w-full  transition-all duration-300 ${
                activeTab == "open"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }   h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Open
            </button>
          </div>
        </div>
      </div>

      <div className="w-full  h-auto relative rounded-3xl bg-gray-50 border  p-4  grid grid-cols-2 gap-2">
        {currentData?.length > 0 ? (
          currentData?.map((ticket, key) => {
            return (
              <TicketCard
                ticket={ticket}
                key={key}
                number={key}
                setUpdate={setUpdate}
              />
            );
          })
        ) : (
          <div className="w-full min-h-[70vh] flex col-span-2 flex-col items-center justify-center">
            <img src="/no-data.png" alt="" className="w-[230px]" />
            <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
              You don’t have added any <br /> Listing Here
            </span>
          </div>
        )}
      </div>

      {!loading && filteredData?.length > 0 && (
        <nav
          class="flex w-full items-center  justify-end mt-2 -space-x-px"
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
      )}
    </div>
  );
};

export default Tickets;
