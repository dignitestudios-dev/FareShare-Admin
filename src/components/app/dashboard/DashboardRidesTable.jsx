import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import { ErrorToast } from "../global/Toast";

const DashboardRidesTable = () => {
  const [showUsers, setShowUsers] = useState(true);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/rides");
      setRides(data?.data); // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRides();
  }, []);

  function convertToMMDDYYYY(dateString) {
    const date = new Date(dateString);

    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  return (
    <div className="w-full h-auto p-6 rounded-[18px]  ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[18px] font-bold leading-[24.3px] text-black">
          Rides{" "}
          <span className="text-[12px] font-normal text-black ">
            ({rides?.length})
          </span>
        </h3>
        <button
          onClick={() => {
            navigate("/rides");
            localStorage.setItem("title", "Rides");
          }}
          className="text-[13px] font-medium text-red-500 border-b border-red-500"
        >
          View all
        </button>
      </div>

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
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <tr className=" animate-pulse">
                      <td className="py-2 px-0">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td className="py-2 px-0">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </td>
                      <td className="py-2 px-0 capitalize">
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      </td>
                    </tr>
                    {/* Line under each row */}
                    <tr>
                      <td colSpan="6" className="border-b border-gray-200"></td>
                    </tr>
                  </React.Fragment>
                ))
              : rides?.slice(0, 6)?.map((ride, index) => (
                  <React.Fragment key={index}>
                    <tr className=" text-[10px] text-gray-900 ">
                      <td className="py-2 px-0">{ride?.user?.name}</td>
                      <td className="py-2 px-0">{ride?.user?.email}</td>

                      <td className="py-2 px-0 capitalize">
                        {ride?.ride?.status}
                      </td>
                      <td className="py-2 px-4">
                        {ride?.ride?.status !== "cancelled" && (
                          <Link
                            to={`/rides/${ride?._id}`}
                            className="  px-3 py-2 rounded-full flex gap-1 h-6  items-center"
                          >
                            <img
                              src={`/eye-icon.png`}
                              alt={ride?.ride?.status}
                            />
                            <span className=" text-black font-medium text-[10px] leading-[17.42px]">
                              View
                            </span>
                          </Link>
                        )}
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

export default DashboardRidesTable;
