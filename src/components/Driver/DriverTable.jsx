import React from "react";
import { FiEye } from "react-icons/fi";
import { MdCheck, MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const DriverTable = ({ data, loading }) => {
  const navigate = useNavigate();
  const handleView = (driver) => {
    navigate(`/driver-details-page/${driver._id}`, { state: driver }); // Pass the entire driver object as state
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[24px] font-bold text-black">
          Driver{" "}
          <span className="text-[16px] text-gray-500">({data?.length})</span>
        </h3>
        {/* You can still keep the search input if you plan to implement it later */}
      </div>

      <div className="w-full bg-white p-6 rounded-[18px] ">
        <table className="min-w-full bg-white border-separate">
          <thead>
            <tr className="text-left text-[11px] font-normal leading-[17.42px] text-[#0A150F80]">
              <th className="">Name</th>
              <th className="px-4">Email</th>
              <th className="px-4">Contact No.</th>
              <th className="px-4">Address</th>
              <th className="px-4">Registration Date</th>
              <th className="pl-4">Action</th>
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
              : data?.map((user, index) => (
                  <React.Fragment key={index}>
                    <tr className="bg-white text-[10px] text-gray-900 ">
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
                      <td className="py-1 px-4">{user?.phoneNo}</td>
                      <td className="py-1 px-4">{user?.street}</td>
                      <td className="py-1 px-4">
                        {convertToMMDDYYYY(user?.createdAt)}
                      </td>
                      <td className="py-1 flex space-x-1 justify-center ">
                        {user?.status == "approved" ? (
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
                        ) : (
                          <>
                            <button className="bg-red-500 text-white w-[26px] h-[26px] flex items-center justify-center  rounded-[8px] hover:bg-red-600">
                              <MdClose className="w-5 h-5" />
                            </button>
                            {/* Approve button */}
                            <button className="bg-green-500 text-white w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-green-600">
                              <MdCheck className="w-5 h-5" />
                            </button>
                            {/* View button */}
                            <div className="text-white w-[26px] h-[26px] bg-[#9F9F9F]  rounded-[8px] flex items-center justify-center hover:bg-blue-600">
                              <FiEye className="h-4 w-5" />
                            </div>
                          </>
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

export default DriverTable;
