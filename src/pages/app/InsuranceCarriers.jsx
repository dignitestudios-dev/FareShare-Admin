import React from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { IoMdNotifications } from "react-icons/io";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import Cookies from "js-cookie";
import { ErrorToast } from "../../components/app/global/Toast";
import InsuranceCarrierCrate from "../../components/app/Insurance/InsuranceCarrierCreate";
import { PiSubtitlesBold } from "react-icons/pi";

const InsuranceCarriers = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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

  const getInsuranceCarriers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/insurances");
      setData(data?.data || []); // Ensure we set an empty array if no data
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInsuranceCarriers();
  }, [update]);

  const filteredData = data?.filter((carrier) =>
    carrier?.name?.toLowerCase().includes(search?.toLowerCase())
  );

  function timeAgo(isoString) {
    const now = new Date();
    const createdAt = new Date(isoString);
    const seconds = Math.floor((now - createdAt) / 1000);

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  }

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-4">
      <InsuranceCarrierCrate
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        setReload={setUpdate}
      />

      <div className="w-full flex items-center justify-end gap-2">
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
        <button
          onClick={() => setIsCreateOpen((prev) => !prev)}
          className={`active:scale-95  flex justify-center items-center w-10 h-10 rounded-full bg shadow-md border border-red-500 text-white  font-medium text-xl  outline-none   hover:opacity-90 transition-all duration-500 ${
            isCreateOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          <span className="leading-3">
            <FiPlus />
          </span>
        </button>
      </div>

      <div className="w-full h-auto grid grid-cols-3 bg-gray-50 border p-4 rounded-3xl gap-2 justify-start items-start">
        {!loading && filteredData?.length > 0
          ? currentData?.map((carrier, index) => {
              return (
                <div
                  key={index}
                  class=" px-4 py-4 bg-gray-100 border rounded-3xl h-auto  w-full"
                >
                  <div class=" inline-flex items-center justify-between w-full">
                    <div class="inline-flex gap-2 items-center">
                      <div className="w-10 h-10 rounded-full bg-[#c00000]/10 flex items-center justify-center">
                        <PiSubtitlesBold className="text-[#c00000] text-2xl" />
                      </div>
                      <h3 class="font-bold text-base text-gray-800">
                        {carrier?.name}
                      </h3>
                    </div>
                    <p class="text-xs text-gray-500">
                      {timeAgo(carrier?.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          : !loading && (
              <div className="w-full min-h-[70vh] flex col-span-3 flex-col items-center justify-center">
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
            class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
            class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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

export default InsuranceCarriers;
