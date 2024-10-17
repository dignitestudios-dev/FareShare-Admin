import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useNavigate } from "react-router-dom";

const BrokerTable = ({ data, loading }) => {
  // Accept data and loading as props
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  // Filter brokers based on search query
  const filteredBrokers = data.filter((broker) =>
    broker.accountHandlerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigate = useNavigate();
  const handleView = (broker) => {
    navigate(`/broker-details/${broker._id}`, { state: broker }); // Pass the entire driver object as state
  };

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }
  return (
    <div className="w-full h-screen bg-[#f8f8f8] p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          Broker{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        {/* <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded"
        /> */}
      </div>

      {/* Table Section */}
      <div className="w-full bg-white p-6 rounded-[18px] ">
        <table className="min-w-full bg-white border-separate">
          <thead>
            <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
              <th className="py-2">Company Name</th>
              <th className="py-2 px-4">Account Holder Name</th>
              <th className="py-2 px-4">Company Email</th>
              <th className="py-2 px-4">Tax Identification Number</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="mt-2">
            {loading
              ? [...Array(5)].map((_, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-white text-[10px] text-gray-900">
                      <td className="flex items-center gap-3 py-1">
                        <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                        <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-40 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-40 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>

                      <td className="py-1 px-4">
                        <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              : filteredBrokers?.map((user, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-white text-[10px] text-gray-900 ">
                      <td className="py-1 ">{user?.companyName}</td>
                      <td className="py-1 px-4">{user?.accountHandlerName}</td>
                      <td className="py-1 px-4">{user?.email}</td>
                      <td className="py-1 px-4">
                        {user?.companyTaxIdenfication}
                      </td>

                      <td className="py-1 px-4">
                        <Link
                          to={`/user-details/${user?._id}`}
                          className="    rounded-[8px] justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
                        >
                          <img
                            src={`/eye-icon-white.png`}
                            alt={user?.firstName}
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
      </div>
    </div>
  );
};

export default BrokerTable;
