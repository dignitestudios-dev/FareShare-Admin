import React, { useState, useEffect, useContext } from "react";
import { FiEye, FiUser } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // Importing the Search icon
import axios from "../../../axios";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { FaCar, FaRegUser, FaStarHalfAlt } from "react-icons/fa";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlinePending } from "react-icons/md";

const UserRidesTable = ({ user }) => {
  const { navigate } = useContext(GlobalContext);
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [searchQuery2, setSearchQuery2] = useState(""); // Search query state

  const [showUsers, setShowUsers] = useState(true);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(null);

  const groupRides = (rides) => {
    return rides.reduce(
      (acc, ride) => {
        if (ride.ride.rideType === "Nemt") {
          acc.nemt.push(ride);
        } else {
          acc.others.push(ride);
        }
        return acc;
      },
      { nemt: [], others: [] }
    );
  };
  const getRides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/rides/user", {
        userId: id,
        search: "",
      });
      setRides(data?.data); // Use the data from the API response
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //   counts:
  function countRidesByStatus(rides) {
    // Initialize a result object to hold the counts
    const statusCounts = {
      pending: 0,
      completed: 0,
      cancelled: 0,
    };

    // Iterate through the rides array
    rides.forEach((ride) => {
      // Get the ride status
      const status = ride?.ride?.status;

      // Increment the corresponding status count
      if (status in statusCounts) {
        statusCounts[status]++;
      }
    });
    console.log(statusCounts);
    setCounts(statusCounts);
  }

  useEffect(() => {
    getRides();
  }, []);

  useEffect(() => {
    countRidesByStatus(rides);
  }, [rides]);

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const filteredData = groupRides(rides)?.others?.filter((ride) => {
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

  const filteredData2 = groupRides(rides)?.nemt?.filter((ride) => {
    const search = searchQuery2?.trim()?.toLowerCase();
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

  const [counts, setCounts] = useState(null);

  // pagination normal  data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // pagination normal  data:

  const [currentPage2, setCurrentPage2] = useState(1);
  const itemsPerPage2 = 5;

  const totalPages2 = Math.ceil(filteredData2.length / itemsPerPage);

  const currentData2 = filteredData2.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage2 = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-start items-start">
      <div className="w-full  grid grid-cols-2 lg:grid-cols-4 justify-start items-start gap-2 lg:gap-6 ">
        <span className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E9FAFF] text-[#35CFFF] text-2xl flex items-center justify-center">
            <MdOutlinePending />
          </span>
          <div className="w-auto flex flex-col justify-start items-start">
            <span className="text-[18px] font-bold text-black">
              {counts?.pending || 0}
            </span>
            <span className="text-black text-[14px] font-normal">
              Pending Rides
            </span>
          </div>
        </span>

        <span className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E9FAFF] text-[#1FBA46] text-3xl flex items-center justify-center">
            <FaRegCircleCheck />
          </span>
          <div className="w-auto flex flex-col justify-start items-start">
            <span className="text-[18px] font-bold text-black">
              {counts?.completed || 0}
            </span>
            <span className="text-black text-[14px] font-normal">
              Completed Rides
            </span>
          </div>
        </span>

        <span className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#FFF5E1] text-[#FFBB39] text-3xl flex items-center justify-center">
            <RxCrossCircled />
          </span>
          <div className="w-auto flex flex-col justify-start items-start">
            <span className="text-[18px] font-bold text-black">
              {counts?.cancelled || 0}
            </span>
            <span className="text-black text-[14px] font-normal">
              Cancelled
            </span>
          </div>
        </span>

        <span className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#0074B633] text-[#0041A4] text-3xl flex items-center justify-center">
            <FaStarHalfAlt />
          </span>
          <div className="w-auto flex flex-col justify-start items-start">
            <span className="text-[18px] font-bold text-black">
              {user?.preferrability * 100 || 0}%
            </span>
            <span className="text-black text-[14px] font-normal">
              Preferrability
            </span>
          </div>
        </span>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        {/* Normal rides */}
        <div className="w-full h-auto  bg-gray-50 border rounded-3xl p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[24px] font-bold text-black">
              Rides{" "}
              <span className="text-[16px] text-gray-500">
                ({groupRides(rides)?.others?.length})
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
                    <th className="py-2 ">Driver Name</th>
                    <th className="py-2 px-4">Contact </th>
                    <th className="py-2 px-4">Booking Date</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2">
                  {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <React.Fragment key={index}>
                          <tr className=" animate-pulse">
                            <td className="flex items-center gap-3 py-1">
                              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </td>
                            <td className="py-1 px-4 capitalize">
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
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
                      ))
                    : currentData?.map((ride, index) => (
                        <React.Fragment key={index}>
                          <tr className=" text-[10px] text-gray-900 ">
                            <td className="flex  items-center gap-3 py-1">
                              <img
                                src={ride?.driver?.profilePicture}
                                alt={ride?.driver?.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <span>{ride?.driver?.name}</span>
                            </td>
                            <td className="py-1 px-4">
                              {ride?.driver?.phoneNo}
                            </td>

                            <td className="py-1 px-4">
                              {convertToMMDDYYYY(ride?.ride?.rideDate)}
                            </td>

                            <td className="py-1 px-4">
                              {
                                <Link
                                  to={`/rides/${ride?._id}`}
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
                                </Link>
                              }
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

        {/* nemt rides */}
        <div className="w-full h-auto  bg-gray-50 border rounded-3xl p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[24px] font-bold text-black">
              Nemt Rides{" "}
              <span className="text-[16px] text-gray-500">
                ({groupRides(rides)?.nemt?.length})
              </span>
            </h3>
            {/* Filters and Search Bar */}
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery2}
                  onChange={(e) => {
                    setSearchQuery2(e.target.value);
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
                    <th className="py-2 ">Driver Name</th>
                    <th className="py-2 px-4">Contact </th>
                    <th className="py-2 px-4">Booking Date</th>
                    <th className="py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="mt-2">
                  {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <React.Fragment key={index}>
                          <tr className=" animate-pulse">
                            <td className="flex items-center gap-3 py-1">
                              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </td>
                            <td className="py-1 px-4 capitalize">
                              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </td>
                            <td className="py-1 px-4">
                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
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
                      ))
                    : currentData2?.map((ride, index) => (
                        <React.Fragment key={index}>
                          <tr className=" text-[10px] text-gray-900 ">
                            <td className="flex  items-center gap-3 py-1">
                              <img
                                src={ride?.driver?.profilePicture}
                                alt={ride?.driver?.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <span>{ride?.driver?.name}</span>
                            </td>
                            <td className="py-1 px-4">
                              {ride?.driver?.phoneNo}
                            </td>

                            <td className="py-1 px-4">
                              {convertToMMDDYYYY(ride?.ride?.rideDate)}
                            </td>

                            <td className="py-1 px-4">
                              {
                                <Link
                                  to={`/rides/${ride?._id}`}
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
                                </Link>
                              }
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
                goToPage2(currentPage2 > 1 ? currentPage2 - 1 : currentPage2)
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
            {Array.from({ length: totalPages2 }, (_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => goToPage2(i + 1)}
                class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${
                  currentPage2 === i + 1
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
                  currentPage2 < totalPages2 ? currentPage2 + 1 : currentPage2
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

export default UserRidesTable;
