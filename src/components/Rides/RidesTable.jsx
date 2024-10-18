import React, { useState, useEffect, useContext } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // Importing the Search icon
import { GlobalContext } from "../../contexts/GlobalContext";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://backend.faresharellc.com";

const RidesTable = () => {
  const { navigate } = useContext(GlobalContext);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showUsers, setShowUsers] = useState(true);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(null);
  const [rideType, setRideType] = useState("User");
  const [category, setCategory] = useState("On Demand");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setSearch(searchQuery);
    }, 400);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const socket = io(SOCKET_SERVER_URL);
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    socket.emit(
      "getRidesAdmin",
      JSON.stringify({
        adminId: localStorage.getItem("adminId"),
        rideType: rideType, //Broker, User
        category: category, // medical, corporate, On Demand, scheduled
        status: status == "All" ? null : status, //"InProgress",//"Pending", "InProgress", "Completed"
        search: searchQuery,
      })
    );

    // Listen for the response from the server
    socket.on("getRidesAdminResponse", (response) => {
      console.log(response);
      setLoading(false);
      setRides(response?.data || []);
    });

    // Cleanup: Disconnect socket when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [rideType, category, status, search]);

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  return (
    <div className="w-full h-screen overflow-auto bg-[#F5F7F7] p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          Rides{" "}
          <span className="text-[16px] text-gray-500">({rides?.length})</span>
        </h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2">
          {/* Date Filter */}
          {/* <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-[10px] px-4 py-4 text-sm text-gray-700 focus:outline-none w-[184px] h-[45px]"
              placeholder="date"
            />
          </div> */}
          {/* ridetype Filter */}
          <div class="relative w-[200px] h-[50px]  text-gray-800 ">
            <select
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
              class="peer p-3 pe-9 block w-[200px] h-[50px] border rounded-lg  outline-none disabled:opacity-50 disabled:pointer-events-none  text-xs
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
              class="peer p-3 pe-9 block w-[150px] h-[50px] border rounded-lg  outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
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
              class="peer p-3 pe-9 block w-[150px] h-[50px] border rounded-lg outline-none disabled:opacity-50 disabled:pointer-events-none text-xs
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
              <option value={"Scheduled"}>Scheduled</option>
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

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search"
              className="border rounded-[10px] pl-4 pr-10 py-4 text-sm text-gray-700 focus:outline-none w-[338px] h-[45px]" // Increased size
            />
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-white p-6 rounded-[18px] ">
        {/* Table Section */}
        <div className="overflow-x-auto bg-white  rounded-xl ">
          <table className="min-w-full bg-white border-separate">
            <thead>
              <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                <th className="py-2 ">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Ridetype </th>
                <th className="py-2 px-4">Registration Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="mt-2">
              {rides?.map((ride, index) => (
                <React.Fragment key={index}>
                  <tr className="bg-white text-[10px] text-gray-900 ">
                    <td className="flex  items-center gap-3 py-1">
                      <img
                        src={ride?.user?.profilePicture}
                        alt={ride?.user?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{ride?.user?.name}</span>
                    </td>
                    <td className="py-1 px-4">{ride?.user?.email}</td>
                    <td className="py-1 px-4">{ride?.ride?.rideType}</td>
                    <td className="py-1 px-4">
                      {convertToMMDDYYYY(ride?.ride?.registrationDate)}
                    </td>
                    <td className="py-1 px-4 capitalize">
                      {ride?.ride?.status}
                    </td>
                    <td className="py-1 px-4">
                      {ride?.ride?.status !== "cancelled" && (
                        <Link
                          to={`/user-details/${ride?._id}`}
                          className="    rounded-[8px] justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
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
                      )}
                    </td>
                  </tr>
                  {/* Line under each row */}
                  <tr>
                    <td colSpan="6" className="border-b border-gray-200"></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>{" "}
      </div>
    </div>
  );
};

export default RidesTable;
