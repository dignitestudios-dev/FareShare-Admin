import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link } from "react-router-dom";

const DashboardUsersTable = () => {
  const [showUsers, setShowUsers] = useState(true);

  // Sample users data (you can replace this with actual data)
  const users = [
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      contact: "(619) 602-6578 X6033",
      address: "878 Mercedes Via, Kossland 18461",
      registrationDate: "2023/5/16",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      contact: "742.486.7602 X9129",
      address: "179 Jacquelyn Shoal, Swiftbury 43486",
      registrationDate: "2022-01-11",
    },
    // Add more user data here...
  ];

  return (
    <div className="w-full h-auto rounded-[10px] bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-bold leading-[24.3px] text-black">
          Users{" "}
          <span className="text-[12px] font-normal text-black">
            ({users.length})
          </span>
        </h3>
        <Link to="/users" className="text-[14px] font-medium text-red-500 border-b border-red-500">
          View all
        </Link>
      </div>

      {showUsers ? (
        <table className="min-w-full bg-white border-separate">
          <thead>
            <tr className="text-left text-[14px] text-gray-500">
              <th className="">Name</th>
              <th className="px-2">Email</th>
              <th className="px-2">Contact No.</th>
              <th className="px-2">Address</th>
              <th className="px-2">Registration Date</th>
              <th className="pl-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white text-[14px] text-gray-900 hover:bg-gray-50">
                  <td className="flex items-center gap-3 py-3">
                    <img
                      src={`https://i.pravatar.cc/30?img=${index}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.contact}</td>
                  <td className="py-3 px-4">{user.address}</td>
                  <td className="py-3 px-4">{user.registrationDate}</td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/user-details`}
                      className="text-red-500 px-3 py-3 rounded-full inline-flex items-center"
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

export default DashboardUsersTable;
