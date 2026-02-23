import React, { useState } from "react";
import { FiEye, FiSearch } from "react-icons/fi";
import { MdClose, MdCheck } from "react-icons/md"; // Close and Check icons
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import VehicleAcceptModal from "./VehicleAcceptModal";
import VehicleRejectModal from "./VehicleRejectModal";
import axios from "../../../axios";
import { ErrorToast, SuccessToast } from "../global/Toast";

const VehicleApprovalTable = ({ data, loading, setUpdate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleView = (vehicle) => {
    Cookies.set("vehicle", JSON.stringify(vehicle));
    navigate(`/vehicle-approval/${vehicle?._id}`); // Pass the entire driver object as state
  };

  // Filter vehicles based on search query
  const filteredVehicles = data?.filter((vehicle) => {
    const vehicleName = vehicle?.vehicleName
      ? vehicle?.vehicleName.toLowerCase()
      : "";

    const vehicleMake = vehicle?.vehicleMake
      ? vehicle?.vehicleMake.toLowerCase()
      : "";

    const plateNumber = vehicle?.plateNumber ? vehicle?.plateNumber : "";

    return (
      vehicleName.includes(searchQuery.toLowerCase()) ||
      vehicleMake.includes(searchQuery.toLowerCase()) ||
      plateNumber.includes(searchQuery.toLowerCase())
    );
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

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const currentData = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full h-auto ">
      {/* Header Section */}
      <div className="flex px-1 justify-between items-center mb-2">
        <h3 className="text-[24px] font-bold text-black">
          Vehicle Approval{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        <div className="relative  bg-transparent">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="border rounded-2xl bg-gray-50 pl-4 pr-10 py-3 text-sm text-gray-700 focus:outline-none w-[400px]"
          />
          <FiSearch className="absolute top-1/2 bg-transparent right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="w-full bg-gray-50 border px-5 py-4 rounded-[18px] ">
        {/* Table Section */}

        <div className="overflow-x-auto   rounded-xl ">
          <table className="min-w-full table-auto border-separate rounded-[18px]">
            {filteredVehicles?.length > 0 && (
              <thead>
                <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                  <th className="py-2 ">Name</th>
                  <th className="py-2 px-4">Driver Name</th>{" "}
                  {/* 👈 SIM / DRIVER */}
                  <th className="py-2 px-4">Make</th>
                  <th className="py-2 px-4">Model</th>
                  <th className="py-2 px-4">Plate Number</th>
                  <th className="py-2 px-4">Wheelchair Accessible</th>
                  <th className="py-2 px-4 flex justify-center">Action</th>
                </tr>
              </thead>
            )}

            <tbody>
              {loading ? (
                [...Array(11)].map((_, index) => (
                  <React.Fragment key={index}>
                    <tr className=" border-b border-gray-200 text-[10px] text-gray-900">
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
                      <td colSpan="6" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              ) : filteredVehicles?.length > 0 ? (
                currentData?.map((vehicle, index) => (
                  <React.Fragment key={index}>
                    <tr className=" border-b border-gray-200 text-[10px] text-gray-900 ">
                      {console.log("🚀 ~ VehicleApprovalTable ~ vehicle:", vehicle)}
                      {/* Name and profile image */}
                      <td className="py-1  flex items-center">
                        <img
                          src={
                            vehicle?.vehicleImageFront
                              ? vehicle?.vehicleImageFront
                              : "https://placehold.co/400"
                          } // Use vehicle image
                          alt="Vehicle"
                          className="w-[25px] h-[25px] rounded-full mr-2"
                        />
                        {vehicle?.vehicleName ? vehicle?.vehicleName : "N/A"}
                      </td>
                      <td className="py-1 px-4">
                        {vehicle?.driverId?.firstName &&
                          vehicle?.driverId?.lastName
                          ? `${vehicle.driverId.firstName} ${vehicle.driverId.lastName}`
                          : "N/A"}
                      </td>
                      <td className="py-1 px-4">
                        {vehicle?.vehicleMake ? vehicle?.vehicleMake : "N/A"}
                      </td>
                      <td className="py-1 px-4">
                        {vehicle?.modelYear ? vehicle?.modelYear : "N/A"}
                      </td>
                      <td className="py-1 px-4">
                        {vehicle?.plateNumber ? vehicle?.plateNumber : "N/A"}
                      </td>
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
                          className="bg-red-500 text-white w-[25px] h-[25px] flex items-center justify-center  rounded-[8px] hover:bg-red-600"
                        >
                          <MdClose className="w-5 h-5" />
                        </button>
                        {/* Approve button */}
                        <button
                          onClick={() => {
                            setOpen(true);
                            Cookies.set("vehicle", JSON.stringify(vehicle));
                          }}
                          className="bg-green-500 text-white w-[25px] h-[25px] flex items-center justify-center rounded-[8px] hover:bg-green-600"
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
                      <td colSpan="6" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center">
                      <img src="/no-data.png" alt="" className="w-[230px]" />
                      <span className="font-semibold text-center text-[#0e0e10] text-[24px] ">
                        You don’t have added any <br /> Listing Here
                      </span>
                    </div>
                  </td>
                </tr>
              )}
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

      {filteredVehicles?.length > 0 && (
        <nav
          class="flex items-center  justify-end mt-2 -space-x-px"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() =>
              goToPage(currentPage > 1 ? currentPage - 1 : currentPage)
            }
            class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
            aria-label="Previous"
          >
            <svg
              class="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            <span class="hidden sm:block">Previous</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => goToPage(i + 1)}
              class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${currentPage === i + 1
                ? " border bg-[#c00000] text-white hover:bg-[#c00000] "
                : "border bg-gray-50"
                }    py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-none  disabled:opacity-50 disabled:pointer-events-none `}
              aria-current="page"
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              goToPage(currentPage < totalPages ? currentPage + 1 : currentPage)
            }
            class="min-h-[38px] min-w-[38px] py-2 bg-gray-50 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
            aria-label="Next"
          >
            <span class="hidden sm:block">Next</span>
            <svg
              class="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
};

export default VehicleApprovalTable;
