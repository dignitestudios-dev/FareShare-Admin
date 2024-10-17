import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";

const NimtTable = ({ data = [], loading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Filter data based on search query and active tab
  const filteredData = data.filter((item) => {
    const matchesSearch = item.insuranceCarrier
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "All" ||
      item.status.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-200 text-green-800";
      case "Unpaid":
        return "bg-red-200 text-red-800";
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "approved":
        return "bg-green-200 text-black";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="w-full h-screen bg-[#f8f8f8] p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          NEMT{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        {/* <input
          type="text"
          placeholder="Search by Insurance Carrier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2"
        /> */}
        {/* Tab Section */}
        <div className="flex  px-1 py-1 border border-gray-300 bg-white rounded-md">
          {["All", "Pending", "Approved", "Rejected"].map(
            (tab, index, array) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === tab
                    ? "bg-red-600 text-white"
                    : "bg-white text-black"
                } ${index === 0 ? "rounded-l" : ""} ${
                  index === array.length - 1 ? "rounded-r" : ""
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-white p-6 rounded-[18px] ">
        <table className="min-w-full bg-white border-separate rounded-[18px]">
          <thead>
            <tr className=" text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
              <th className="py-2 ">Insurance Carrier</th>
              <th className="py-2 px-4">Insurance Number</th>
              <th className="py-2 px-4">Subscriber Number</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(15)].map((_, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-white text-[10px] text-gray-900">
                      <td className="py-1">
                        <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </td>
                      <td className="py-1 px-4">
                        <div className="bg-gray-300 w-[75px] h-[26px] rounded-[8px] flex items-center justify-center"></div>
                      </td>
                    </tr>
                    {/* Line under each row */}
                    <tr>
                      <td colSpan="5" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              : filteredData.map((item, key) => (
                  <React.Fragment key={key}>
                    <tr
                      key={item._id}
                      className="bg-white text-[10px] text-gray-900 "
                    >
                      <td className="py-1 ">{item?.insuranceCarrier}</td>
                      <td className="py-1 px-4">{item?.insuranceNumber}</td>
                      <td className="py-1 px-4">{item?.subscriberNumber}</td>
                      <td className="py-1 px-4">
                        <span
                          className={`py-1 px-2 capitalize rounded-full ${getStatusClass(
                            item?.status
                          )}`}
                        >
                          {item?.status}
                        </span>
                      </td>
                      <td className="py-1 px-4">
                        <Link
                          to={`/nemt-details/${item?._id}`}
                          className="    rounded-[8px] justify-center bg-[#c00000] flex  h-[26px] gap-1 w-[75px]  items-center"
                        >
                          <img
                            src={`/eye-icon-white.png`}
                            alt={item?.insuranceNumber}
                            className="mb-[0.2px]"
                          />
                          <span className=" text-white font-medium text-[10px] leading-none">
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

export default NimtTable;
