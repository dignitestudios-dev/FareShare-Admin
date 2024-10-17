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
    {
      name: "Michael Jon",
      email: "michaeljon@gmail.com",
      status: "Cancelled",
    },
  ];

  return (
    <div className="w-full h-auto p-6 rounded-[18px] bg-white ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-bold leading-[24.3px] text-black">
          Rides{" "}
          <span className="text-[12px] font-normal text-black ">
            ({users.length})
          </span>
        </h3>
        <Link
          to="/rides"
          className="text-[13px] font-medium text-red-500 border-b border-red-500"
        >
          View all
        </Link>
      </div>

      {showUsers ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80] ">
                <th className="">Name</th>
                <th className="">Email</th>
                <th className=" ">Status</th>
                <th className="pl-8">Action</th>
              </tr>
            </thead>
            <tbody className="mt-2">
              {users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[10px] text-gray-900 "
                >
                  <td className="py-2 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/30?img=${index}`}
                      alt={user.name}
                      className="w-[26px] h-[26px] rounded-full"
                    />
                    <span>{user.name}</span>
                  </td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.status}</td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/ride-details`}
                      className="  px-3 py-2 rounded-full flex gap-1 h-6  items-center"
                    >
                      <img src={`/eye-icon.png`} alt={user.name} />
                      <span className=" text-black font-medium text-[10px] leading-[17.42px]">
                        View
                      </span>
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

export default DashboardRidesTable;
