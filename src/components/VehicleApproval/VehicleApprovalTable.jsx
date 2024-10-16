import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdClose, MdCheck } from "react-icons/md"; // Close and Check icons
import { Link, useNavigate } from "react-router-dom";

const VehicleApprovalTable = ({ data, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()
  const handleView=(vehicle)=>{
    navigate(`/vehicle-approve-details/${vehicle._id}`, { state: vehicle }); // Pass the entire driver object as state
  }
  // Filter vehicles based on search query
  const filteredVehicles = data.filter((vehicle) => {
    const vehicleName = vehicle.vehicleName ? vehicle.vehicleName.toLowerCase() : "";
    return vehicleName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full h-screen bg-[#f8f8f8] p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          Vehicle Approval{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        {/* <input
          type="text"
          placeholder="Search by Vehicle Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded"
        /> */}
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center bg-[#F5F7F7]">
        <div className="text-gray-500">Loading...</div>
      </div>      ) : (
        <div className="overflow-x-auto bg-white pt-4 pl-2 rounded-xl shadow-lg">
          <table className="min-w-full table-auto border-separate rounded-[18px]">
            <thead>
              <tr className="text-left text-[14px] text-gray-500">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Make</th>
                <th className="py-2 px-4">Model</th>
                <th className="py-2 px-4">Plate Number</th>
                <th className="py-2 px-4">Wheelchair Accessible</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle, index) => (
                <React.Fragment key={index}>
                  <tr className="bg-white border-b border-gray-200 text-[14px] text-gray-900 hover:bg-gray-50">
                    {/* Name and profile image */}
                    <td className="py-3 px-4 flex items-center">
                      <img
                        src={vehicle?.vehicleImageFront} // Use vehicle image
                        alt="Vehicle"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      {vehicle?.vehicleName}
                    </td>
                    <td className="py-3 px-4">{vehicle?.vehicleMake}</td>
                    <td className="py-3 px-4">{vehicle?.vehicleModel}</td>
                    <td className="py-3 px-4">{vehicle?.plateNumber}</td>
                    <td className="py-3 px-4">{vehicle?.isWheelChairAccessible ? "Yes" : "No"}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      {/* Reject button */}
                      <button className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                        <MdClose className="w-5 h-5" />
                      </button>
                      {/* Approve button */}
                      <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">
                        <MdCheck className="w-5 h-5" />
                      </button>
                      {/* View button */}
                      <div onClick={()=>handleView(vehicle)}  className="text-white bg-red-500 py-2 px-4 rounded-md flex items-center justify-center hover:bg-blue-600">
                    <FiEye className="mr-1" />
                    <span className="text-sm">View</span>
                  </div>
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
      )}
    </div>
  );
};

export default VehicleApprovalTable;
