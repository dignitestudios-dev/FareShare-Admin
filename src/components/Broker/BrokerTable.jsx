import React, { useState } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useNavigate } from "react-router-dom";

const BrokerTable = ({ data, loading }) => { // Accept data and loading as props
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  // Filter brokers based on search query
  const filteredBrokers = data.filter((broker) =>
    broker.accountHandlerName.toLowerCase().includes(searchQuery.toLowerCase())
  );  
  const navigate = useNavigate()
  const handleView=(broker)=>{
    navigate(`/broker-details/${broker._id}`, { state: broker }); // Pass the entire driver object as state
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
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center bg-[#F5F7F7]">
        <div className="text-gray-500">Loading...</div>
      </div>
            ) : (
        <table className="min-w-full bg-white border-separate rounded-[18px]">
          <thead>
            <tr className="text-left text-[14px] text-gray-500">
              <th className="py-2 px-4">Company Name</th>
              <th className="py-2 px-4">Account Holder Name</th>
              <th className="py-2 px-4">Company Email</th>
              <th className="py-2 px-4">Tax Identification Number</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrokers.map((broker, index) => (
              <React.Fragment key={index}>
                <tr className="bg-white border-b border-gray-200 text-[14px] text-gray-900 hover:bg-gray-50">
                  <td className="py-3 px-4">{broker?.companyName}</td>
                  <td className="py-3 px-4">{broker?.accountHandlerName}</td>
                  <td className="py-3 px-4">{broker?.email}</td>
                  <td className="py-3 px-4">{broker?.companyTaxIdenfication}</td>
                  <td className="py-3 px-4">
                  <div onClick={()=>handleView(broker)}  className="text-white bg-red-500 py-2 px-4 rounded-md flex items-center justify-center hover:bg-blue-600">
                    <FiEye className="mr-1" />
                    <span className="text-sm">View</span>
                  </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="5" className="border-b border-gray-200"></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BrokerTable;
