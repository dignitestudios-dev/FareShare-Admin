import React, { useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { MdCheck, MdClose, MdRadioButtonChecked } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../../axios";
import DriverAcceptModal from "../../../components/app/driver/DriverAcceptModal";
import DriverRejectModal from "../../../components/app/driver/DriverRejectModal";
import { ErrorToast, SuccessToast } from "../global/Toast";

const DriverTable = ({ data, loading, setUpdate }) => {
  const navigate = useNavigate();

  const handleView = (driver) => {
    Cookies.set("driver", JSON.stringify(driver));
    navigate(`/drivers/${driver?._id}`, { state: driver });
  };

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const [open, setOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const [closeOpen, setCloseOpen] = useState(false);

  const toggleAccept = async () => {
    try {
      setAcceptLoading(true);
      const { data } = await axios.post("/admin/approveDriver", {
        driverId: JSON.parse(Cookies?.get("driver"))?._id,
        isApproved: true,
        vehicleType: "Standard",
        // reason: "Documents are incorrect",
      });
      if (data?.success) {
        setOpen(false);
        setUpdate((prev) => !prev);
        SuccessToast("Driver Approved Successfully.");
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

      const { data } = await axios.post("/admin/approveDriver", {
        driverId: JSON.parse(Cookies?.get("driver"))?._id,
        isApproved: false,
        // vehicleType: "Standard",
        reason:
          "Your Driver Profile failed to meet the FareShare Standards Compliance",
      });
      if (data?.success) {
        setCloseOpen(false);
        setUpdate((prev) => !prev);
        SuccessToast("Driver Rejected Successfully.");
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeclineLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = React.useState("");
  const [tab, setTab] = useState("");

  // Filter drivers based on search query and tab
  const filteredDrivers = data.filter((driver) => {
    const fullName = `${driver?.firstName || ""} ${
      driver?.lastName || ""
    }`.toLowerCase();
    const driverStatus = driver?.status?.toLowerCase();
    const searchMatch = fullName.includes(searchQuery.toLowerCase());
    const statusMatch = tab == "" ? true : driverStatus === tab;

    return searchMatch && statusMatch; // Both conditions must match
  });

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const currentData = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full max-h-screen overflow-y-hidden  ">
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-[24px] font-bold text-black">
          Driver{" "}
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
                setTab("approved");
                setCurrentPage(1);
              }}
              className={`w-full transition-all duration-300 ${
                tab == "approved"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }  h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Approved
            </button>
            <button
              onClick={() => {
                setTab("pending");
                setCurrentPage(1);
              }}
              className={`w-full  transition-all duration-300 ${
                tab == "pending"
                  ? "bg-[#c00000] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-[#c00000] hover:text-white"
              }   h-full rounded-xl flex items-center justify-center  text-xs font-medium`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-50 border px-5 py-4 rounded-[18px] ">
        <table className="min-w-full  border-separate">
          <thead>
            <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
              <th className="">Name</th>
              <th className="px-4">Email</th>
              <th className="px-4">Contact No.</th>
              <th className="px-4">Address</th>
              <th className="px-4">Registration Date</th>
              <th className="pl-4">Action</th>
            </tr>
          </thead>
          <tbody className="mt-2">
            {loading
              ? [...Array(10)].map((_, index) => (
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
                      <td colSpan="6" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              : currentData?.map((user, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr className=" text-[10px] text-gray-900 ">
                        <td className="flex  items-center gap-3 py-1">
                          <img
                            src={user?.profilePicture}
                            alt={user?.firstName}
                            className="w-[26px] h-[26px] rounded-full"
                          />
                          <span>
                            {user?.firstName} {user?.lastName}
                          </span>
                        </td>
                        <td className="py-1 px-4">{user?.email}</td>
                        <td className="py-1 px-4">{user?.phoneNo}</td>
                        <td className="py-1 px-4">{user?.street}</td>
                        <td className="py-1 px-4">
                          {convertToMMDDYYYY(user?.createdAt)}
                        </td>
                        <td className="py-1 flex space-x-1 justify-center ">
                          {user?.status == "approved" ? (
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
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setCloseOpen(true);
                                  Cookies.set("driver", JSON.stringify(user));
                                }}
                                className="bg-red-500 text-white w-[26px] h-[26px] flex items-center justify-center  rounded-[8px] hover:bg-red-600"
                              >
                                <MdClose className="w-5 h-5" />
                              </button>
                              {/* Approve button */}
                              <button
                                onClick={() => {
                                  setOpen(true);
                                  Cookies.set("driver", JSON.stringify(user));
                                }}
                                className="bg-green-500 text-white w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-green-600"
                              >
                                <MdCheck className="w-5 h-5" />
                              </button>
                              {/* View button */}
                              <button
                                onClick={() => handleView(user)}
                                className="text-white w-[26px] h-[26px] bg-[#9F9F9F]  rounded-[8px] flex items-center justify-center hover:bg-blue-600"
                              >
                                <FiEye className="h-4 w-5" />
                              </button>
                            </>
                          )}
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
                  );
                })}
          </tbody>
        </table>

        <DriverAcceptModal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          onConfirm={() => toggleAccept()}
          loading={acceptLoading}
        />

        {/* Reject Modal */}
        <DriverRejectModal
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
    </div>
  );
};

export default DriverTable;
