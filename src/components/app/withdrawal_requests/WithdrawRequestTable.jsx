import React, { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { TbCaretDownFilled } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import { ErrorToast, SuccessToast } from "../global/Toast";
import ApproveWithdrawModal from "./ApproveWithdrawModal";
const WithdrawRequestTable = ({ data, loading, setUpdate }) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  function convertToMMDDYYYY(dateString) {
    if (dateString == null) return `Invalid Date`;
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  // Filter users based on the search query
  const filteredUsers = data.filter((user) => {
    const fullName = `${user?.name || ""}`.toLowerCase();
    const email = `${user?.email}`;
    const searchMatch =
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());
    // const insuranceCareer = user?.insuranceCarrier?.toLowerCase();
    // const careerMatch =
    //   insurance == null ? true : user?.insuranceCarrier?._id === insurance?._id;

    return searchMatch; // Both conditions must match
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

  const [open, setOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const toggleAccept = async (id, isApproved) => {
    try {
      setAcceptLoading(true);
      const { data } = await axios.post("/admin/withdraw", {
        withdrawId: id,
        isApproved: isApproved,
      });
      if (data?.success) {
        setOpen(false);
        setUpdate((prev) => !prev);
        SuccessToast(
          `Withdrawal ${isApproved ? "approved" : "rejected"} successfully.`
        );
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const convertEpochToMMDDYYYY = (epoch) => {
    if (!epoch) return "Invalid Date"; // Handle invalid input
    const date = new Date(epoch * 1000); // Convert epoch to milliseconds
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="w-full  max-h-screen overflow-y-hidden  ">
      <div className="flex justify-between px-1 items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Withdrawal Requests{" "}
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
        </div>
      </div>
      <div className="w-full  bg-gray-50 border p-5 rounded-[18px] ">
        <table className="min-w-full  border-separate">
          <thead>
            {filteredUsers?.length > 0 && (
              <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                <th className="">Name</th>
                <th className="px-4">Email</th>
                <th className="px-4">Withdrawn On</th>
                <th className="px-4">Amount</th>
                <th className="px-4">Status</th>
                <th className="pl-4">
                  <span className="w-full flex justify-center items-center">
                    Action
                  </span>
                </th>
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
                      {/* <img
                        src={user?.profilePicture}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full"
                      /> */}
                      <span>{user?.name}</span>
                    </td>
                    <td className="py-1 px-4">{user?.email}</td>
                    <td className="py-1 px-4">
                      {convertEpochToMMDDYYYY(user?.dateRequested)}
                    </td>

                    <td className="py-1 px-4 max-w-sm text-wrap break-words">
                      ${parseFloat(user?.amount).toFixed(2)}
                    </td>
                    <td className="py-1 px-4">
                      {user?.status == "pending" ? (
                        <span className="text-[#f7cc3e] border border-[#f7cc3e] bg-[#f7cc3e]/[0.1]  px-2 py-1 rounded-full">
                          Pending
                        </span>
                      ) : user?.status == "approved" ? (
                        <span className="text-[#7aba26] border border-[#7aba26]  bg-[#7aba26]/[0.1]  px-2 py-1 rounded-full">
                          Approved
                        </span>
                      ) : (
                        <span className="text-[#ba3226] border border-[#ba3226]  bg-[#ba3226]/[0.1]  px-2 py-1 rounded-full">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-1 px-4">
                      {user?.status == "approved" ? (
                        <div className="w-auto flex gap-2 items-center justify-center">
                          <span className="text-[#7aba26] border border-[#7aba26]  bg-[#7aba26]/[0.1]  px-2 py-1 rounded-full">
                            Approved on:{" "}
                            {convertToMMDDYYYY(user?.withdrawCompletionDate)}
                          </span>
                        </div>
                      ) : user?.status == "unapproved" ? (
                        <div className="w-auto flex gap-2 items-center justify-center">
                          <span className="text-[#ba2b26] border border-[#ba2b26]  bg-[#ba2b26]/[0.1]  px-2 py-1 rounded-full">
                            Rejected on:{" "}
                            {convertToMMDDYYYY(user?.withdrawCompletionDate)}
                          </span>
                        </div>
                      ) : (
                        <div className="w-auto flex gap-2 items-center justify-center">
                          <button
                            onClick={() => {
                              setOpen(true);
                              setIsApproved(true);
                              setSelectedUser(user?._id);
                            }}
                            className="    rounded-full justify-center bg-[#8bf63e] flex  h-[26px] gap-1 w-[75px]  items-center"
                          >
                            <span className=" text-black font-medium text-[11px] leading-none">
                              Approve
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setOpen(true);
                              setIsApproved(false);
                              setSelectedUser(user?._id);
                            }}
                            className="    rounded-full justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
                          >
                            <span className=" text-white font-medium text-[11px] leading-none">
                              Reject
                            </span>
                          </button>
                        </div>
                      )}
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
      <ApproveWithdrawModal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        onConfirm={() => toggleAccept(selectedUser, isApproved)}
        loading={acceptLoading}
        isApproved={isApproved}
      />

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

export default WithdrawRequestTable;
