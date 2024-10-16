import React from "react";
import { FiEye } from "react-icons/fi"; 
import { Link, useNavigate } from "react-router-dom";

const DriverTable = ({ data = [], loading }) => {
  const navigate = useNavigate()
  const handleView=(driver)=>{
    navigate(`/driver-details-page/${driver._id}`, { state: driver }); // Pass the entire driver object as state
  }
  return (
    <div className="w-full h-screen bg-[#f8f8f8] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          Driver{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        {/* You can still keep the search input if you plan to implement it later */}
        <input
          type="text"
          placeholder="Search..."
          // You can manage searchQuery state if needed later
          className="border rounded p-2"
        />
      </div>

      {loading ? (
        <div className="w-full h-screen flex items-center justify-center bg-[#F5F7F7]">
        <div className="text-gray-500">Loading...</div>
      </div>
      ) : (
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
            {data.map((driver) => (
              <tr key={driver?._id} className="bg-white text-[14px] font-normal text-gray-900 hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={driver?.profilePicture} 
                    alt={driver?.firstName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{driver?.firstName} {driver?.lastName}</span>
                </td>
                <td className="py-1">{driver?.email}</td>
                <td className="py-1">{driver?.phoneNo}</td>
                <td className="py-1">{driver?.vehicleCount}</td>
                <td className="py-1 flex justify-center items-center space-x-2">
                  <div onClick={()=>handleView(driver)}  className="text-white bg-red-500 py-2 px-4 rounded-md flex items-center justify-center hover:bg-blue-600">
                    <FiEye className="mr-1" />
                    <span className="text-sm">View</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverTable;
