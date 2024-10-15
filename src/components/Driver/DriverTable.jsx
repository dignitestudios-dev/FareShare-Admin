import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Eye icon for the action
import { MdClose, MdCheck } from "react-icons/md"; // Close and Check icons
import { Link } from "react-router-dom";

const DriverTable = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showUsers, setShowUsers] = useState(true);

  // Sample users data (you can replace this with actual data)
  const users = [
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      contact: "(619) 602-6578 X6033",
      vehicles: 4,
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      contact: "742.486.7602 X9129",
      vehicles: 4,
    },
    {
      name: "John Doe",
      email: "johndoe@example.com",
      contact: "123-456-7890",
      vehicles: 4,
    },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-screen bg-[#f8f8f8] p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          Driver{" "}
          <span className="text-[16px] text-gray-500">({users.length})</span>
        </h3>
      </div>

      {/* Table Section */}
      {showUsers ? (
        <table className="min-w-full bg-white border-separate border-spacing-y-2 rounded-[18px]">
          <thead>
            <tr className="text-left text-[14px] text-gray-500">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Contact No.</th>
              <th className="py-2 px-4">Vehicles</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white text-[14px] font-normal text-gray-900 hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?img=${index}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-1">{user.email}</td>
                  <td className="py-1 ">{user.contact}</td>
                  <td className="py-1 ">{user.vehicles}</td>
                  <td className="py-1 flex justify-center items-center space-x-2">
                    {index === 0 ? (
                      <>
                        <button className="bg-red-500 text-white p-1 rounded-lg hover:bg-red-600">
                          <MdClose className="w-5 h-5" />
                        </button>
                        <button className="bg-green-500 text-white p-1 rounded-lg hover:bg-green-600">
                          <MdCheck className="w-5 h-5" />
                        </button>
                        <Link
                          to={`/driver-details-page`}
                          className="bg-gray-300 text-gray-600 p-1 rounded-lg hover:bg-gray-400 flex justify-center items-center"
                        >
                          <FiEye className="w-5 h-5" />
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/driver-details-page`}
                        className="text-white bg-red-500 py-2 px-4 rounded-md flex items-center justify-center hover:bg-red-600"
                      >
                        <FiEye className="mr-1 mb-[3px]" />
                        <span className="text-sm">View</span>
                      </Link>
                    )}
                  </td>
                </tr>
                {/* Line under each row */}
                <tr>
                  <td colSpan="5" className="border-b border-gray-200"></td>
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

export default DriverTable;
