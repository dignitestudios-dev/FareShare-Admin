import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link } from "react-router-dom";

const DashboardRidesTable = () => {
  const [showUsers, setShowUsers] = useState(true);

  // Sample users data (you can replace this with actual data)
  const users = [
    {
      name: "Mike Smith",
      email: "mikesmith12@gmail.com",
      status: "Ongoing",
    },
    {
      name: "Olivia James",
      email: "oliviajames@gmail.com",
      status: "Completed",
    },
    {
      name: "Dani Mok",
      email: "danimok@gmail.com",
      status: "Pending",
    },
    {
      name: "Michael Jon",
      email: "michaeljon@gmail.com",
      status: "Cancelled",
    },
  ];

  return (
    <div className="w-full h-auto p-6 rounded-[18px] bg-white shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-bold leading-[24.3px] text-black">
          Rides{" "}
          <span className="text-[12px] font-normal text-black ">
            ({users.length})
          </span>
        </h3>
        <Link to="/rides" className="text-[14px] font-medium text-red-500 border-b border-red-500">
          View all
        </Link>
      </div>

      {showUsers ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-[14px] text-gray-500 ">
                <th className="">Name</th>
                <th className="">Email</th>
                <th className=" ">Status</th>
                <th className="pl-8">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[14px] text-gray-900 hover:bg-gray-50"
                >
                  <td className="py-4 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/30?img=${index}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="">{user.email}</td>
                  <td className="">{user.status}</td>
                  <td className="py-3 px-4">
                  <Link
                    to={`/ride-details`}
                    className=" text-red-500 px-3 py-3 rounded-full inline-flex items-center"
                  >
                    <FiEye className="mr-2" />
                    View
                  </Link>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default DashboardRidesTable
