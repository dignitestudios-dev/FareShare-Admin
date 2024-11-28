import React, { useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const BrokerTable = ({ data, loading }) => {
  // Accept data and loading as props
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  // Filter brokers based on search query
  const filteredBrokers = data.filter(
    (broker) =>
      broker?.accountHandlerName
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      broker?.companyName?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      broker?.companyTaxIdenfication
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()) ||
      broker?.email?.toLowerCase().includes(searchQuery?.toLowerCase())
  );
  const navigate = useNavigate();
  const handleView = (broker) => {
    Cookies.set("broker", JSON.stringify(broker));
    navigate(`/brokers/${broker?._id}`, { state: broker });
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

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(filteredBrokers.length / itemsPerPage);

  const currentData = filteredBrokers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="w-full h-full overflow-y-hidden  ">
      {/* Header Section */}
      <div className="flex justify-between px-1 items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Broker{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
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
      </div>

      {/* Table Section */}
      <div className="w-full bg-gray-50 border px-5 py-4 rounded-[18px] ">
        <table className="min-w-full  border-separate">
          {filteredBrokers?.length > 0 && (
            <thead>
              <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                <th className="py-2">Company Name</th>
                <th className="py-2 px-4">Account Holder Name</th>
                <th className="py-2 px-4">Company Email</th>
                <th className="py-2 px-4">Tax Identification Number</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
          )}

          <tbody className="mt-2">
            {loading ? (
              [...Array(12)].map((_, index) => (
                <React.Fragment key={index}>
                  <tr className=" text-[10px] text-gray-900">
                    <td className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                      <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-40 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-40 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>

                    <td className="py-1 px-4">
                      <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="border-b border-gray-200"></td>
                  </tr>
                </React.Fragment>
              ))
            ) : filteredBrokers?.length > 0 ? (
              currentData?.map((user, index) => (
                <React.Fragment key={index}>
                  <tr className=" text-[10px] text-gray-900 ">
                    <td className="py-1 ">{user?.companyName}</td>
                    <td className="py-1 px-4">{user?.accountHandlerName}</td>
                    <td className="py-1 px-4">{user?.email}</td>
                    <td className="py-1 px-4">
                      {user?.companyTaxIdenfication}
                    </td>

                    <td className="py-1 px-4">
                      <button
                        onClick={() => handleView(user)}
                        className="    rounded-full justify-center bg-[#c00000] flex  h-[25px] gap-1 w-[75px]  items-center"
                      >
                        <img
                          src={`/eye-icon-white.png`}
                          alt={user?.firstName}
                          className="mb-[0.2px]"
                        />
                        <span className=" text-white font-medium text-[11px] leading-none">
                          View
                        </span>
                      </button>
                    </td>
                  </tr>
                  {/* Line under each row */}
                  <tr>
                    <td colSpan="6" className="border-b border-gray-200"></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
                    <img src="/no-data.png" alt="" className="w-[230px]" />
                    <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
                      You don’t have added any <br /> Listing Here
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredBrokers?.length > 0 && (
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
      )}
    </div>
  );
};

export default BrokerTable;
