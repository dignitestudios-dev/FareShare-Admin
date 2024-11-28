import React, { useState, useEffect, useContext } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // Importing the Search icon
import axios from "../../../axios";

const RidesList = () => {
  const navigate = useNavigate();

  const handleView = (ride) => {
    navigate(`/rides/${ride?._id}`, { state: ride }); // Pass the entire driver object as state
  };
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showUsers, setShowUsers] = useState(true);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(null);
  const [rideType, setRideType] = useState("User");
  const [category, setCategory] = useState("On Demand");
  const [sub, setSub] = useState("");

  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setSearch(searchQuery);
    }, 400);
  }, [searchQuery]);

  const getRides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/rides/admin", {
        rideType: rideType, //Broker, User
        subcategory: sub == "" ? null : sub,
        category: category, // medical, corporate, On Demand, scheduled
        status: status == "All" ? null : status, //"InProgress",//"Pending", "InProgress", "Completed"
        search: "",
      });
      setRides(data?.data); // Use the data from the API response
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRides();
  }, [rideType, category, status, sub]);

  const filteredData = rides.filter((ride) => {
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
  const itemsPerPage = 10;

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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Rides{" "}
          <span className="text-[16px] text-gray-500">({rides?.length})</span>
        </h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2">
          {/* ridetype Filter */}
          <div class="relative w-[200px] h-[50px]  text-gray-800 ">
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              class="peer p-3 pe-9 block w-[200px] h-[50px] border bg-gray-50 rounded-2xl  outline-none disabled:opacity-50 disabled:pointer-events-none  text-xs
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
            >
              <option value={"User"}>User</option>
              <option value={"Broker"}>Broker</option>
            </select>
            <label
              class="absolute -top-1 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
            >
              Select Ride Type
            </label>
          </div>

          {/* Status Filter */}
          <div class="relative w-[150px] h-[50px]  text-gray-800 ">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              class="peer p-3 pe-9 block w-[150px] h-[50px] border bg-gray-50 rounded-2xl  outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
            >
              <option value={"All"}>All</option>

              <option value={"InProgress"}>In Progress</option>
              <option value={"Pending"}>Pending</option>
              <option value={"Completed"}>Completed</option>
              <option value={"Cancelled"}>Cancelled</option>
            </select>
            <label
              class="absolute -top-1 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
            >
              Select Status
            </label>
          </div>

          <div class="relative w-[150px] h-[50px]  text-gray-800 ">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              class="peer p-3 pe-9 block w-[150px] h-[50px] border bg-gray-50 rounded-2xl outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
            >
              <option value={"medical"}>Medical</option>
              <option value={"corporate"}>Corporate</option>
              <option value={"On Demand"}>On Demand</option>
              <option value={"Nemt"}>NEMT</option>
            </select>
            <label
              class="absolute -top-1 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
            >
              Select Category
            </label>
          </div>
          <div class="relative w-[150px] h-[50px]  text-gray-800 ">
            <select
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              class="peer p-3 pe-9 block w-[150px] h-[50px] border bg-gray-50 rounded-2xl outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
            >
              <option value={""}>All</option>
              <option value={"instant"}>Instant</option>
              <option value={"scheduled"}>Scheduled</option>
            </select>
            <label
              class="absolute -top-1 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
            >
              Select Sub Category
            </label>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search"
              className="border rounded-2xl pl-4 pr-10 py-4 text-sm bg-gray-50 text-gray-700 focus:outline-none w-[338px] h-[50px]" // Increased size
            />
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-gray-50 px-5 py-4 border rounded-[18px] ">
        {/* Table Section */}
        <div className="overflow-x-auto   rounded-xl ">
          <table className="min-w-full  border-separate">
            {filteredData?.length > 0 && (
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
            )}

            <tbody className="mt-2">
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <tr className=" animate-pulse">
                      <td className=" py-1">
                        <div className="w-auto flex justify-start items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      </td>
                      <td className="px-4 py-1">
                        <div className="w-auto flex justify-start items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        </div>
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
                      <td colSpan="6" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              ) : filteredData?.length > 0 ? (
                currentData?.map((ride, index) => (
                  <React.Fragment key={index}>
                    <tr className="w-full  text-[10px] text-gray-900 ">
                      <td className=" gap-3 py-1">
                        <div className="w-auto flex justify-start items-start gap-2">
                          <img
                            src={
                              ride?.user?.profilePicture
                                ? ride?.user?.profilePicture
                                : "https://placehold.co/400"
                            }
                            alt={ride?.user?.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className=" flex flex-col  justify-start items-start">
                            <span>{ride?.user?.name || "N/A"}</span>
                            <span className="">
                              {ride?.user?.email || "N/A"}
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className=" gap-3 py-1">
                        <div className="w-auto flex justify-start items-start gap-2">
                          <img
                            src={
                              ride?.driver?.profilePicture
                                ? ride?.driver?.profilePicture
                                : "https://placehold.co/400"
                            }
                            alt={ride?.driver?.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className=" flex flex-col  justify-start items-start">
                            <span>{ride?.driver?.name || "N/A"}</span>
                            <span className="">
                              {ride?.driver?.email || "N/A"}
                            </span>
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
                      <td colSpan="6" className="border-b border-gray-200"></td>
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
        </div>{" "}
      </div>
      {!loading && filteredData?.length > 0 && (
        <nav
          class="flex items-center  justify-end mt-2 pb-2 -space-x-px"
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
              goToPage(currentPage < totalPages ? currentPage + 1 : currentPage)
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
  );
};

export default RidesList;
