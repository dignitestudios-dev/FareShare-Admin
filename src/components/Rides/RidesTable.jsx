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
    // Add more user data here...
  ];

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              className="border border-gray-300 rounded-md px-4 py-4 text-sm text-gray-700 focus:outline-none w-[184px] h-[45px]"
              placeholder="date"
            />
          </div>

          {/* ridetype Filter */}
          <div className="relative">
            <select className="border border-gray-300 rounded-md px-2 text-sm text-gray-700 focus:outline-none w-[120px] h-[45px]">
              <option>Ridetype</option>
              <option>Economy</option>
              <option>Premium</option>
              <option>Shared</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select className="border border-gray-300 rounded-md text-sm px-4 text-gray-700 focus:outline-none w-[110px] h-[45px]">
              <option>Status</option>
              <option>Ongoing</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="border rounded-md pl-4 pr-10 py-4 text-sm text-gray-700 focus:outline-none w-[448px] h-[45px]" // Increased size
          />
          <FiSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
        </div>
      </div>

      {/* Table Section */}
      {showUsers ? (
        <table className="min-w-full  bg-white border-separate rounded-[18px]">
          <thead>
            <tr className="text-left text-[14px] text-gray-500">
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Ridetype </th>
              <th className="py-4 px-4">Registration Date</th>
              <th className="py-4 px-4">status</th>
              <th className="py-4 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white text-[14px] text-gray-900 hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?img=${index}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.ridetype}</td>
                  <td className="py-3 px-4">{user.registrationDate}</td>
                  <td className="py-3 px-4">{user.status}</td>
                  <td className="py-3 px-4">
                    <Link
                      // to={`/user/${user.email}`}
                      to={`/ride-details`}

                      className="text-white bg-red-500 py-1 px-3 rounded-md inline-flex items-center"
                    >
                       <FiEye className="mr-2 mb-1" />
                      View
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
      ) : (
        <div
          onClick={() => setShowUsers((prev) => !prev)}
          className="w-full cursor-pointer py-8 flex justify-center items-center text-[16px] font-normal leading-[21.6px] text-black"
        >
          Click here to load the users table
        </div>
      )}
    </div>
  );
};

export default RidesTable;
