import React, { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { TbCaretDownFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import { ErrorToast } from "../global/Toast";
const UsersTable = ({ data, loading }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();
  const handleView = (user) => {
    navigate(`/users/${user?._id}`, { state: user }); // Pass the entire driver object as state
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

  const [tab, setTab] = useState("");

  const filteredUsers = data.filter((user) => {
    const fullName = `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.toLowerCase();
    const email = `${user?.email || ""}`.toLowerCase();
    const id = `${user?.fareShareId || ""}`.toLowerCase();
    const userBlock = user?.isBlocked;

    // Check if the search query matches the user information
    const searchMatch = searchQuery
      ? fullName.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        id.includes(searchQuery.toLowerCase())
      : true; // If no search query, include all users

    // Check if the user matches the tab filter
    const blockedMatch =
      tab === ""
        ? true // Show all users
        : tab === "blocked"
        ? userBlock === true // Show only blocked users
        : tab === "unblocked"
        ? userBlock === false // Show only unblocked users
        : true; // Default to all users if tab is unrecognized

    // Both conditions must match
    return searchMatch && blockedMatch;
  });

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="w-full  max-h-screen overflow-y-hidden  ">
      <div className="flex justify-between px-1 items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Users{" "}
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
          <div className="w-80 h-11 bg-gray-50 grid grid-cols-3 gap-1 items-center justify-start border p-1 rounded-2xl">
            <button
              onClick={() => {
                setTab("");
                setCurrentPage(1);
              }}
              className={`w-full transition-all duration-300 ${
                tab == ""
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }  h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              All
            </button>
            <button
              onClick={() => {
                setTab("blocked");
                setCurrentPage(1);
              }}
              className={`w-full transition-all duration-300 ${
                tab == "blocked"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }  h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Blocked
            </button>
            <button
              onClick={() => {
                setTab("unblocked");
                setCurrentPage(1);
              }}
              className={`w-full  transition-all duration-300 ${
                tab == "unblocked"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }   h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Unblocked
            </button>
          </div>
          {/* <div class=" w-44 relative inline-flex">
            <button
              onClick={() => setOpenInsurance((prev) => !prev)}
              type="button"
              class={`hs-dropdown-toggle h-11 w-full ${
                openInsurance ? "rounded-2xl border" : "rounded-2xl border"
              } px-2 text-xs font-medium  bg-gray-50 text-gray-600 inline-flex justify-center items-center gap-x-2`}
              aria-expanded="false"
              aria-label="Menu"
            >
              <span>
                {insurance == null ? "Insurrance Carrier" : insurance?.name}
              </span>
              <TbCaretDownFilled />
            </button>

            <div
              class={`group w-full transition-all rounded-2xl p-2 duration    ${
                openInsurance
                  ? "flex flex-col justify-start items-start  opacity-100"
                  : "hidden opacity-0"
              } z-10 mt-2  bg-gray-50 divide-y group-last::rounded-b-2xl border shadow absolute top-10 left-0`}
            >
              <div className="w-full max-h-56 p-1  overflow-y-auto grid grid-cols-1 gap-1 justify-start items-start">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={insuranceSearch}
                    onChange={(e) => {
                      setInsuranceSearch(e.target.value);
                    }}
                    placeholder="Search"
                    className="border rounded-lg pl-2 pr-10 py-2 text-sm bg-gray-100 text-gray-700 focus:outline-none w-full h-8" // Increased size
                  />
                  <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                </div>
                {filteredInsurance?.map((carrier, key) => (
                  <button
                    onClick={() => {
                      setInsurance(carrier);
                      setOpenInsurance(false);
                    }}
                    class={`w-full h-7  hover:bg-gray-200 ${
                      insurance?.name == carrier?.name && "bg-gray-200"
                    }  flex items-center justify-start px-2 text-xs rounded-md font-medium text-gray-600`}
                  >
                    {carrier?.name}
                  </button>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="w-full  bg-gray-50 border p-5 rounded-[18px] ">
        <table className="min-w-full  border-separate">
          <thead>
            {filteredUsers?.length > 0 && (
              <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                <th className="">Name</th>
                <th className="px-4">Email</th>
                <th className="px-4">Contact No.</th>
                <th className="px-4">Fareshare ID</th>
                <th className="px-4">Registered On</th>
                <th className="pl-4">Action</th>
              </tr>
            )}
          </thead>
          <tbody className="mt-2">
            {loading ? (
              [...Array(10)].map((_, index) => (
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
                      <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="border-b "></td>
                  </tr>
                </React.Fragment>
              ))
            ) : filteredUsers?.length > 0 ? (
              currentData?.map((user, index) => (
                <React.Fragment key={index}>
                  <tr className=" text-[10px] text-gray-900 ">
                    <td className="flex  items-center gap-3 py-1">
                      <img
                        src={user?.profilePicture}
                        alt={user?.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>
                        {user?.firstName} {user?.lastName}
                      </span>
                    </td>
                    <td className="py-1 px-4">{user?.email}</td>
                    <td className="py-1 px-4">{user?.phoneNo}</td>
                    <td className="py-1 px-4 max-w-sm text-wrap break-words">
                      {user?.fareShareId || "N/A"}
                    </td>
                    <td className="py-1 px-4">
                      {convertToMMDDYYYY(user?.createdAt)}
                    </td>
                    <td className="py-1 px-4">
                      <button
                        onClick={() => handleView(user)}
                        className="    rounded-full justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
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
                    <td colSpan="6" className="border-b "></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6">
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

      {!loading && filteredUsers?.length > 0 && (
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

export default UsersTable;
