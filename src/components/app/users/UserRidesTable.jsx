import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axios from "../../../axios";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlinePending } from "react-icons/md";

const UserRidesTable = ({ user }) => {
  const { navigate } = useContext(GlobalContext);
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchQueryReferral, setSearchQueryReferral] = useState("");

  const [rides, setRides] = useState([]);
  const [referralUser, setReferralUser] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setRides(data?.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const getuserReferrals = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/admin/userReferrals/${id}`);
      setReferralUser(data?.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  function countRidesByStatus(rides) {

    const statusCounts = {
      pending: 0,
      completed: 0,
      cancelled: 0,
    };


    rides.forEach((ride) => {

      const status = ride?.ride?.status;


      if (status in statusCounts) {
        statusCounts[status]++;
      }
    });
    console.log(statusCounts);
    setCounts(statusCounts);
  }

  useEffect(() => {
    getRides();
    getuserReferrals()
  }, []);

  useEffect(() => {
    countRidesByStatus(rides);
  }, [rides]);

  function convertToMMDDYYYY(dateString) {
    if (dateString == null) return "Invalid Date";
    const date = new Date(dateString);


    const month = String(date.getMonth() + 1).padStart(2, "0");
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

  const filteredUsers = referralUser.filter((user) => {
    const fullName = `${user?.referred?.firstName || ""} ${user?.referred?.lastName || ""
      }`.toLowerCase();
    const email = `${user?.referred?.email || ""}`.toLowerCase();
    const id = `${user?.referred?.fareShareId || ""}`.toLowerCase();



    const searchMatch = searchQueryReferral
      ? fullName.includes(searchQueryReferral.toLowerCase()) ||
      email.includes(searchQueryReferral.toLowerCase()) ||
      id.includes(searchQueryReferral.toLowerCase())
      : true;





    return searchMatch;
  });






  const [counts, setCounts] = useState(null);


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



  const [currentPage3, setCurrentPage3] = useState(1);
  const itemsPerPage3 = 5;

  const totalPages3 = Math.ceil(filteredData2.length / itemsPerPage);

  const currentData3 = filteredData2.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage3 = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const yes = user?.preferrabilityYes || 0;
  const no = user?.preferrabilityNo || 0;
  const total = yes + no;

  const preferabilityPercent =
    total > 0 ? `${Math.round((yes / total) * 100)}%` : "0%";



  return (
    <div className="w-full flex flex-col gap-4 justify-start items-start">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">

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

        <span className="w-full h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#0074B633] text-[#0041A4] text-3xl flex items-center justify-center">
            <FaStarHalfAlt />
          </span>

          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-black">
              {preferabilityPercent}
            </span>

            <span className="text-[13px] text-gray-600">
              Yes: {yes} | No: {no}
            </span>

            <span className="text-black text-[14px] font-normal">
              Preferability
            </span>
          </div>
        </span>

      </div>
      <div className="w-full bg-gray-50 border rounded-3xl p-4">
        <h3 className="text-[20px] font-bold text-black mb-4">
          Fund Transactions
        </h3>

        <div className="flex flex-col gap-3">
          {user?.fundsHistory?.length > 0 ? (
            user?.fundsHistory?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white border rounded-2xl p-4"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold uppercase">
                    {item.brand}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      **** **** **** {item.last4}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">
                    +${item.amount}
                  </span>
                  <p className="text-xs text-gray-400">
                    Card Payment
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No fund transactions found.</p>
          )}
        </div>
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
                {groupRides(rides)?.others?.length > 0 && (
                  <thead>
                    <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                      <th className="py-2 ">Driver Name</th>
                      <th className="py-2 px-4">Contact </th>
                      <th className="py-2 px-4">Booking Date</th>
                      <th className="py-2 px-4">Action</th>
                    </tr>
                  </thead>
                )}

                <tbody className="mt-2">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
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
                  ) : groupRides(rides)?.others?.length > 0 ? (
                    currentData?.map((ride, index) => (
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
                          <td className="py-1 px-4">{ride?.driver?.phoneNo}</td>

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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="w-full min-h-52 flex flex-col items-center justify-center">
                          <img
                            src="/no-data.png"
                            alt=""
                            className="w-[150px]"
                          />
                          <span className="font-semibold text-center text-[#0e0e10] text-[20px] ">
                            You don’t have added any <br /> Listing Here
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>{" "}
          </div>

          {!loading && groupRides(rides)?.others?.length > 0 && (
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
                  class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${currentPage === i + 1
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
          )}
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
                {groupRides(rides)?.nemt?.length > 0 && (
                  <thead>
                    <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                      <th className="py-2 ">Driver Name</th>
                      <th className="py-2 px-4">Contact </th>
                      <th className="py-2 px-4">Booking Date</th>
                      <th className="py-2 px-4">Action</th>
                    </tr>
                  </thead>
                )}

                <tbody className="mt-2">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
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
                  ) : groupRides(rides)?.nemt?.length > 0 ? (
                    currentData2?.map((ride, index) => (
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
                          <td className="py-1 px-4">{ride?.driver?.phoneNo}</td>

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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="w-full min-h-52 flex flex-col items-center justify-center">
                          <img
                            src="/no-data.png"
                            alt=""
                            className="w-[150px]"
                          />
                          <span className="font-semibold text-center text-[#0e0e10] text-[20px] ">
                            You don’t have added any <br /> Listing Here
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>{" "}
          </div>

          {!loading && groupRides(rides)?.nemt?.length > 0 && (
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
                  class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${currentPage2 === i + 1
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
          )}
        </div>
      </div>
      <div className="w-full h-auto  bg-gray-50 border rounded-3xl p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[24px] font-bold text-black">
            Referal User
            <span className="text-[16px] text-gray-500">
              ({filteredUsers.length})
            </span>
          </h3>
          {/* Filters and Search Bar */}
          <div className="flex gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQueryReferral}
                onChange={(e) => {
                  setSearchQueryReferral(e.target.value);
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
              {filteredUsers?.length > 0 && (
                <thead>
                  <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                    <th className="py-2 ">User Name</th>
                    <th className="py-2 px-4">Email </th>
                    <th className="py-2 px-4">Contact </th>
                    <th className="py-2 px-4">Referall Date</th>
                    {/* <th className="py-2 px-4">Action</th> */}
                  </tr>
                </thead>
              )}

              <tbody className="mt-2">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
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
                ) : filteredUsers.length > 0 ? (
                  filteredUsers?.map((referral, index) => (
                    <React.Fragment key={index}>
                      <tr className=" text-[10px] text-gray-900 ">
                        <td className="flex  items-center gap-3 py-1">
                          <img
                            src={referral?.referred?.profilePicture}
                            alt={referral?.referred?.firstName}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{referral?.referred?.firstName}</span>
                        </td>
                        <td className="py-1 px-4">{referral?.referred?.email}</td>
                        <td className="py-1 px-4">{referral?.referred?.phoneNo}</td>

                        <td className="py-1 px-4">
                          {convertToMMDDYYYY(referral?.referred?.createdAt)}
                        </td>

                        {/* <td className="py-1 px-4">
                          {
                            <div
                              onClick={() =>
                                navigate(`/users/${referral?.referred?._id}`, {
                                  state: referral?.referred,
                                })
                              }

                              className="  cursor-pointer  rounded-full justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
                            >
                              <img
                                src={`/eye-icon-white.png`}
                                alt={referral?.referred?.name}
                                className="mb-[0.2px]"
                              />
                              <span className=" text-white font-medium text-[11px] leading-none">
                                View
                              </span>
                            </div>
                          }
                        </td> */}
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
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="w-full min-h-52 flex flex-col items-center justify-center">
                        <img
                          src="/no-data.png"
                          alt=""
                          className="w-[150px]"
                        />
                        <span className="font-semibold text-center text-[#0e0e10] text-[20px] ">
                          You don’t have added any <br /> Listing Here
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>{" "}
        </div>

        {!loading && filteredUsers.length > 0 && (
          <nav
            class="flex items-center  justify-end mt-2 -space-x-px"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={() =>
                goToPage3(currentPage3 > 1 ? currentPage3 - 1 : currentPage3)
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
                onClick={() => goToPage3(i + 1)}
                class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${currentPage3 === i + 1
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
                goToPage3(
                  currentPage3 < totalPages3 ? currentPage3 + 1 : currentPage3
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
        )}
      </div>
    </div>
  );
};

export default UserRidesTable;
