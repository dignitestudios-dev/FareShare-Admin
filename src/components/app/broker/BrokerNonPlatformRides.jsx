import React, { useState, useEffect, useContext } from "react";
import { FiEye, FiUser } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // Importing the Search icon
import axios from "../../../axios";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { FaCar, FaRegUser } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";

const BrokerNonPlatformRides = ({ broker }) => {
  const { navigate } = useContext(GlobalContext);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const filteredData = broker?.offPlatformRides?.filter((ride) => {
    const search = searchQuery?.trim()?.toLowerCase();
    const userName = ride?.user?.name?.toLowerCase() || "";
    const userEmail = ride?.user?.email?.toLowerCase() || "";
    const driverName = ride?.driver?.name?.toLowerCase() || "";
    const driverEmail = ride?.driver?.email?.toLowerCase() || "";

    return (
      userName.includes(search) ||
      userEmail.includes(search) ||
      driverName.includes(search) ||
      driverEmail.includes(search)
    );
  });

  //   // pagination normal  data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-start items-start">
      <div className="w-full grid grid-cols-1 gap-4">
        <div className="w-full h-auto  bg-gray-50 border rounded-3xl p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[24px] font-bold text-black">
              Off Platform Rides{" "}
              <span className="text-[16px] text-gray-500">
                ({broker?.offPlatformRides?.length})
              </span>
            </h3>
            {/* Filters and Search Bar */}
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search"
                  className="border rounded-2xl pl-4 pr-10 py-4 bg-gray-100 text-sm text-gray-700 focus:outline-none w-[238px] h-[50px]" // Increased size
                />
                <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full  px-5 py-4 bg-gray-100 border rounded-[18px] ">
            {/* Table Section */}
            <div className="overflow-x-auto   rounded-xl ">
              <table className="min-w-full  border-separate">
                <thead>
                  <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                    <th className="py-2 ">User</th>
                    <th className="py-2">Driver</th>
                    <th className="py-2 px-4">Ridetype </th>
                    <th className="py-2 px-4">Registration Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2">
                  {currentData?.map((ride, index) => (
                    <React.Fragment key={index}>
                      <tr className="w-full  text-[10px] text-gray-900 ">
                        <td className=" gap-3 py-1">
                          <div className="w-auto flex justify-start items-start gap-2">
                            <img
                              src={ride?.user?.profilePicture}
                              alt={ride?.user?.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className=" flex flex-col  justify-start items-start">
                              <span>{ride?.user?.name}</span>
                              <span className="">{ride?.user?.email}</span>
                            </span>
                          </div>
                        </td>

                        <td className=" gap-3 py-1">
                          <div className="w-auto flex justify-start items-start gap-2">
                            <img
                              src={ride?.driver?.profilePicture}
                              alt={ride?.driver?.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className=" flex flex-col  justify-start items-start">
                              <span>{ride?.driver?.name}</span>
                              <span className="">{ride?.driver?.email}</span>
                            </span>
                          </div>
                        </td>

                        <td className="py-1 px-4">{ride?.ride?.rideType}</td>
                        <td className="py-1 px-4">
                          {convertToMMDDYYYY(ride?.ride?.registrationDate)}
                        </td>
                        <td className="py-1 px-4 capitalize">
                          {ride?.ride?.status}
                        </td>
                        <td className="py-1 px-4">
                          <button
                            onClick={() => handleView(ride)}
                            className="    rounded-full justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
                          >
                            <img
                              src={`/eye-icon-white.png`}
                              alt={ride?.user?.name}
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
                        <td
                          colSpan="6"
                          className="border-b border-gray-200"
                        ></td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>{" "}
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
              class="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
                    : "border bg-gray-100"
                }    py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-none  disabled:opacity-50 disabled:pointer-events-none `}
                aria-current="page"
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                goToPage(
                  currentPage < totalPages ? currentPage + 1 : currentPage
                )
              }
              class="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
      </div>
    </div>
  );
};

export default BrokerNonPlatformRides;
