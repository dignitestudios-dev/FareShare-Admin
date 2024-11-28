import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi"; // Using the Eye icon for the action
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../axios";
import Cookies from "js-cookie";
import { ErrorToast } from "../global/Toast";

const DashboardDriverTable = () => {
  const [showUsers, setShowUsers] = useState(true);
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleView = (driver) => {
    Cookies.set("driver", JSON.stringify(driver));
    localStorage.setItem("title", "Drivers");
    navigate(`/drivers/${driver?._id}`, { state: driver });
  };
  const getDrivers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/admin/driver");
      setDriverData(data?.data); // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);

      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDrivers();
  }, []);

  // Sample users data (you can replace this with actual data)

  function convertToMMDDYYYY(dateString) {
    if (dateString == null) return "Invalid Date";
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
          Drivers{" "}
          <span className="text-[12px] font-normal text-black ">
            ({driverData?.length})
          </span>
        </h3>
        <button
          onClick={() => {
            navigate("/drivers");
            localStorage.setItem("title", "Drivers");
          }}
          className="text-[13px] font-medium text-red-500 border-b border-red-500"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full  border-separate">
          {driverData?.length > 0 && (
            <thead>
              <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
                <th className="">Name</th>
                <th className="px-4">Email</th>
                <th className="px-4">Vehicles</th>
                <th className="pl-4">Action</th>
              </tr>
            </thead>
          )}

          <tbody className="mt-2">
            {loading ? (
              [...Array(5)].map((_, index) => (
                <React.Fragment key={index}>
                  <tr className=" text-[10px] text-gray-900">
                    <td className="flex items-center gap-3 py-1">
                      <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                      <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td className="py-1 px-4">
                      <div className="w-40 h-4 bg-gray-300 animate-pulse rounded"></div>
                    </td>

                    <td className="py-1 px-4">
                      <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
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
            ) : driverData?.length > 0 ? (
              driverData?.slice(0, 5)?.map((user, index) => (
                <React.Fragment key={index}>
                  <tr className=" text-[10px] text-gray-900 ">
                    <td className="flex  items-center gap-3 py-1">
                      <img
                        src={user?.profilePicture}
                        alt={user?.firstName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>
                        {user?.firstName} {user?.lastName}
                      </span>
                    </td>
                    <td className="py-1 px-4">{user?.email}</td>

                    <td className="py-1 px-4">{user?.vehicleCount}</td>
                    <td className="py-1 ">
                      <button
                        onClick={() => handleView(user)}
                        className="  px-3 py-2 rounded-full flex gap-1 h-6  items-center"
                      >
                        <img src={`/eye-icon.png`} alt={user.name} />
                        <span className=" text-black font-medium text-[10px] leading-[17.42px]">
                          View
                        </span>
                      </button>
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
                <td colSpan="4">
                  <div className="w-full min-h-52 flex flex-col items-center justify-center">
                    <img src="/no-data.png" alt="" className="w-[150px]" />
                    <span className="font-semibold text-center text-[#0e0e10] text-[20px] ">
                      You don’t have added any <br /> Listing Here
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardDriverTable;
