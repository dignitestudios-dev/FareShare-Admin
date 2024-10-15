import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link } from "react-router-dom";

const NimtTable = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [activeTab, setActiveTab] = useState("All"); // To keep track of the selected tab
  const [showUsers, setShowUsers] = useState(true);

  // Sample users data (you can replace this with actual data)
  const users = [ 
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      contact: "(619) 602-6578 X6033",
      status: "Waiting for approval",
    }, 
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      contact: "(619) 602-6578 X6033",
      status: "Unpaid",
    },
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      contact: "(619) 602-6578 X6033",
      status: "Waiting for approval",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      contact: "742.486.7602 X9129",
      status: "Paid",
    },
    {
      name: "John Doe",
      email: "johndoe@example.com",
      contact: "555-123-4567",
      status: "Unpaid",
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      contact: "555-765-4321",
      status: "Paid",
    },
    // Add more user data here...
  ];

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-200 text-green-800"; // Green background for Paid
      case "Unpaid":
        return "bg-red-200 text-red-800"; // Yellow background for Unpaid
      default:
        return "";
    }
  };

  return (
    <div className="w-full h-screen bg-[#f8f8f8] p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          NIMT{" "}
          <span className="text-[16px] text-gray-500">({users.length})</span>
        </h3>

        {/* Tab Section */}
        <div className="flex">
          {["All", "Requested", "Approved", "Reject"].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2 text-sm font-semibold ${
                activeTab === tab
                  ? "bg-red-600 text-white"
                  : "bg-white text-black"
              } ${
                index === 0
                  ? "rounded-l-md" // Round left edges for the first button
                  : index === 3
                  ? "rounded-r-md" // Round right edges for the last button
                  : ""
              } ${index > 0 ? "-ml-px" : ""}`} // Overlap borders to remove gap
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      {showUsers ? (
        <table className="min-w-full bg-white border-separate rounded-[18px]">
          <thead>
            <tr className="text-left text-[14px] text-gray-500">
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Contact No.</th>
              <th className="py-4 px-4">Status</th>
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
                  <td className="py-3 px-4">{user.contact}</td>
                  <td className="py-3 px-4">
                    <span className={`py-1 px-2 rounded-full ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/nimt-details`}
                      className="text-white bg-red-500 py-1 px-3 rounded-md inline-flex items-center"
                    >
                      <FiEye className="mr-2 mb-1" />
                      View
                    </Link>
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

export default NimtTable;
