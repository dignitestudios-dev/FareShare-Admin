import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; 
import { Link } from "react-router-dom";

const NimtTable = ({ data = [], loading }) => {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [activeTab, setActiveTab] = useState("All"); 

  // Filter data based on search query and active tab
  const filteredData = data.filter(item => {
    const matchesSearch = item.insuranceCarrier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || item.status.toLowerCase() === activeTab.toLowerCase();
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
  {["All", "Requested", "Approved", "Rejected"].map((tab, index, array) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-semibold ${
        activeTab === tab
          ? "bg-red-600 text-white"
          : "bg-white text-black"
      } ${index === 0 ? "rounded-l" : ""} ${index === array.length - 1 ? "rounded-r" : ""}`}
    >
      {tab}
    </button>
  ))}
</div>

      </div>

      

      {/* Table Section */}
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center bg-[#F5F7F7]">
        <div className="text-gray-500">Loading...</div>
      </div>      ) : (
        <table className="min-w-full bg-white border-separate rounded-[18px]">
          <thead>
            <tr className="text-left text-[14px] text-gray-500">
              <th className="py-4 px-4">Insurance Carrier</th>
              <th className="py-4 px-4">Insurance Number</th>
              <th className="py-4 px-4">Subscriber Number</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item._id} className="bg-white text-[14px] text-gray-900 hover:bg-gray-50">
                <td className="py-3 px-4">{item?.insuranceCarrier}</td>
                <td className="py-3 px-4">{item?.insuranceNumber}</td>
                <td className="py-3 px-4">{item?.subscriberNumber}</td>
                <td className="py-3 px-4">
                  <span className={`py-1 px-2 rounded-full ${getStatusClass(item?.status)}`}>
                    {item?.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link
                    to={`/nimt-details/${item?._id}`}
                    className="text-white bg-red-500 py-1 px-3 rounded-md inline-flex items-center"
                  >
                    <FiEye className="mr-2 mb-1" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NimtTable;
