import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // Importing the Search icon

const RidesTable = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showUsers, setShowUsers] = useState(true);

  // Sample users data (you can replace this with actual data)
  const users = [
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      ridetype: "(619) 602-6578 X6033",
      status: "Ongoing",
      registrationDate: "2023/5/16",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Completed",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Cancelled",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Pending",
      registrationDate: "2022-01-11",
    },

    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      ridetype: "(619) 602-6578 X6033",
      status: "Ongoing",
      registrationDate: "2023/5/16",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Completed",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Cancelled",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Pending",
      registrationDate: "2022-01-11",
    },
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      ridetype: "(619) 602-6578 X6033",
      status: "Ongoing",
      registrationDate: "2023/5/16",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Completed",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Cancelled",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Pending",
      registrationDate: "2022-01-11",
    },
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      ridetype: "(619) 602-6578 X6033",
      status: "Ongoing",
      registrationDate: "2023/5/16",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Completed",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Cancelled",
      registrationDate: "2022-01-11",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      ridetype: "742.486.7602 X9129",
      status: "Pending",
      registrationDate: "2022-01-11",
    },
    // Add more user data here...
  ];

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <span className="text-[16px] text-gray-500">({users.length})</span>
        </h3>
        {/* Filters and Search Bar */}
        <div className="flex gap-2">
          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              className="border rounded-[10px] px-4 py-4 text-sm text-gray-700 focus:outline-none w-[184px] h-[45px]"
              placeholder="date"
            />
          </div>
          {/* ridetype Filter */}
          <div className="relative">
            <select className="border  rounded-[10px] px-1 text-sm text-gray-700 focus:outline-none w-[120px] h-[45px]">
              <option value={""}>Ride Type</option>
              <option value={"User"}>User</option>
              <option value={"Broker"}>Broker</option>
            </select>
          </div>
          {/* Status Filter */}
          <div className="relative">
            <select className="border  rounded-[10px] text-sm px-1 text-gray-700 focus:outline-none w-[110px] h-[45px]">
              <option value={""}>Status</option>
              <option value={"InProgress"}>InProgress</option>
              <option value={"Pending"}>Pending</option>
              <option value={"Completed"}>Completed</option>
            </select>
          </div>
          {/* Status Filter */}
          <div className="relative">
            <select className="border  rounded-[10px] text-sm px-1 text-gray-700 focus:outline-none w-[110px] h-[45px]">
              <option value={""}>Category</option>
              <option value={"medical"}>Medical</option>
              <option value={"corporate"}>Corporate</option>
              <option value={"On Demand"}>On Demand</option>
              <option value={"Scheduled"}>Scheduled</option>
            </select>
          </div>
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="border rounded-[10px] pl-4 pr-10 py-4 text-sm text-gray-700 focus:outline-none w-[338px] h-[45px]" // Increased size
            />
            <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-white p-6 rounded-[18px] ">
        (
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
            {users?.map((user, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white text-[10px] text-gray-900 ">
                  <td className="flex  items-center gap-3 py-1">
                    <img
                      src={
                        "https://cdn.pixabay.com/photo/2019/08/29/12/10/model-4438821_640.jpg"
                      }
                      alt={user?.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user?.name}</span>
                  </td>
                  <td className="py-1 px-4">{user?.email}</td>
                  <td className="py-1 px-4">{user?.ridetype}</td>
                  <td className="py-1 px-4">
                    {convertToMMDDYYYY(user?.registrationDate)}
                  </td>
                  <td className="py-1 px-4">{user?.status}</td>
                  <td className="py-1 px-4">
                    <Link
                      to={`/user-details/${user?._id}`}
                      className="    rounded-[8px] justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
                    >
                      <img
                        src={`/eye-icon-white.png`}
                        alt={user?.name}
                        className="mb-[0.2px]"
                      />
                      <span className=" text-white font-medium text-[11px] leading-none">
                        View
                      </span>
                    </Link>
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
        )
      </div>
    </div>
  );
};

export default RidesTable;
