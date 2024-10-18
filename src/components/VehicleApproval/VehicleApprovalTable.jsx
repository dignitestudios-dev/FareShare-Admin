import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import { MdClose, MdCheck } from "react-icons/md"; // Close and Check icons
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import VehicleAcceptModal from "../../pages/VehicleApproval/VehicleAcceptModal";
import VehicleRejectModal from "../../pages/VehicleApproval/VehicleRejectModal";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../global/Toast";

const VehicleApprovalTable = ({ data, loading, setUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleView = (vehicle) => {
    Cookies.set("vehicle", JSON.stringify(vehicle));
    navigate(`/vehicle-approve-details/${vehicle?._id}`); // Pass the entire driver object as state
  };
  // Filter vehicles based on search query
  const filteredVehicles = data.filter((vehicle) => {
    const vehicleName = vehicle.vehicleName
      ? vehicle.vehicleName.toLowerCase()
      : "";
    return vehicleName.includes(searchQuery.toLowerCase());
  });

  const [open, setOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const [vehicleType, setVehicleType] = useState("");
  const [closeOpen, setCloseOpen] = useState(false);

  const toggleAccept = async () => {
    try {
      setAcceptLoading(true);
      if (vehicleType == "") {
        ErrorToast("Please select a vehicle type");
      } else {
        const { data } = await axios.post("/admin/vehicle", {
          vehicleId: JSON.parse(Cookies?.get("vehicle"))?._id,
          isApproved: true,
          vehicleType: vehicleType, //"Standard", "XL Vehicle", "Lux Vehicle", "Black Lux Vehicle", "Black Lux XL Vehicle", "Wheelchair Accessible Vehicle"
          //"reason": "Poorly maintained" //Send when isApproved is false => for email
        });
        if (data?.success) {
          setOpen(false);
          setUpdate((prev) => !prev);
          SuccessToast("Vehicle Approved Successfully.");
        }
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const toggleDecline = async () => {
    try {
      setDeclineLoading(true);

      const { data } = await axios.post("/admin/vehicle", {
        vehicleId: JSON.parse(Cookies?.get("vehicle"))?._id,
        isApproved: false,
        // vehicleType: vehicleType, //"Standard", "XL Vehicle", "Lux Vehicle", "Black Lux Vehicle", "Black Lux XL Vehicle", "Wheelchair Accessible Vehicle"
        reason:
          "Your vehicle was rejected as it did not meet FareShare Standard Compliance", //Send when isApproved is false => for email
      });
      if (data?.success) {
        setCloseOpen(false);
        setUpdate((prev) => !prev);
        SuccessToast("Vehicle Declined Successfully.");
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeclineLoading(false);
    }
  };

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
      <div className="w-full bg-white p-6 rounded-[18px] ">
        {/* Table Section */}

        <div className="overflow-x-auto bg-white  rounded-xl ">
          <table className="min-w-full table-auto border-separate rounded-[18px]">
            <thead>
              <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                <th className="py-2 ">Name</th>
                <th className="py-2 px-4">Make</th>
                <th className="py-2 px-4">Model</th>
                <th className="py-2 px-4">Plate Number</th>
                <th className="py-2 px-4">Wheelchair Accessible</th>
                <th className="py-2 px-4 flex justify-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(15)].map((_, index) => (
                    <React.Fragment key={index}>
                      <tr className="bg-white border-b border-gray-200 text-[10px] text-gray-900">
                        {/* Name and profile image */}
                        <td className="py-1 flex items-center">
                          <div className="w-[26px] h-[26px] bg-gray-300 animate-pulse rounded-full mr-2"></div>
                          <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        <td className="py-1 px-4">
                          <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        <td className="py-1 px-4">
                          <div className="w-16 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        <td className="py-1 px-4">
                          <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        <td className="py-1 px-4">
                          <div className="w-16 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        <td className="py-1 px-4 flex space-x-2">
                          <div className="bg-gray-300 w-[26px] h-[26px] rounded-[8px] flex items-center justify-center"></div>
                          <div className="bg-gray-300 w-[26px] h-[26px] rounded-[8px] flex items-center justify-center"></div>
                          <div className="bg-gray-300 w-[26px] h-[26px] rounded-[8px] flex items-center justify-center"></div>
                        </td>
                      </tr>
                      {/* Line under each row */}
                      <tr>
                        <td
                          colSpan="6"
                          className="border-b border-gray-200"
                        ></td>
                      </tr>
                    </React.Fragment>
                  ))
                : filteredVehicles.map((vehicle, index) => (
                    <React.Fragment key={index}>
                      <tr className="bg-white border-b border-gray-200 text-[10px] text-gray-900 ">
                        {/* Name and profile image */}
                        <td className="py-1  flex items-center">
                          <img
                            src={vehicle?.vehicleImageFront} // Use vehicle image
                            alt="Vehicle"
                            className="w-[26px] h-[26px] rounded-full mr-2"
                          />
                          {vehicle?.vehicleName}
                        </td>
                        <td className="py-1 px-4">{vehicle?.vehicleMake}</td>
                        <td className="py-1 px-4">{vehicle?.modelYear}</td>
                        <td className="py-1 px-4">{vehicle?.plateNumber}</td>
                        <td className="py-1 px-4">
                          {vehicle?.isWheelChairAccessible ? "Yes" : "No"}
                        </td>
                        <td className="py-1 px-4 flex space-x-1 justify-center">
                          {/* Reject button */}
                          <button
                            onClick={() => {
                              setCloseOpen(true);
                              Cookies.set("vehicle", JSON.stringify(vehicle));
                            }}
                            className="bg-red-500 text-white w-[26px] h-[26px] flex items-center justify-center  rounded-[8px] hover:bg-red-600"
                          >
                            <MdClose className="w-5 h-5" />
                          </button>
                          {/* Approve button */}
                          <button
                            onClick={() => {
                              setOpen(true);
                              Cookies.set("vehicle", JSON.stringify(vehicle));
                            }}
                            className="bg-green-500 text-white w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-green-600"
                          >
                            <MdCheck className="w-5 h-5" />
                          </button>
                          {/* View button */}
                          <div
                            onClick={() => handleView(vehicle)}
                            className="text-white w-[26px] h-[26px] bg-[#9F9F9F]  rounded-[8px] flex items-center justify-center hover:bg-blue-600"
                          >
                            <FiEye className="h-4 w-5" />
                          </div>
                        </td>
                      </tr>
                      {/* Line under each row */}
                      <tr>
                        <td
                          colSpan="6"
                          className="border-b border-gray-200"
                        ></td>
                      </tr>
                    </React.Fragment>
                  ))}
            </tbody>
          </table>

          <VehicleAcceptModal
            isOpen={open}
            onRequestClose={() => {
              setOpen(false);
            }}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            onConfirm={() => {
              toggleAccept();
            }}
            loading={acceptLoading}
          />
          <VehicleRejectModal
            isOpen={closeOpen}
            onRequestClose={() => {
              setCloseOpen(false);
            }}
            onConfirm={() => {
              toggleDecline();
            }}
            loading={declineLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleApprovalTable;
