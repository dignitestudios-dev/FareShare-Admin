import React from "react";
import { FiEye } from "react-icons/fi"; // Eye icon for the view action
import { Link, useLocation } from "react-router-dom";

const UserDetails = () => {
  const location = useLocation();
  const user = location.state; // Get user data from location state

  if (!user) {
    return <div className="text-red-500">User data not found.</div>;
  }

  // Sample users data for rides taken (can be replaced with actual data)
  const users = [
    {
      name: "Dani Mok",
      contact: "(619) 602-6578 X6033",
      bookingDate: "2023/5/16",
    },
    {
      name: "Olivia James",
      contact: "(619) 602-6578 X6033",
      bookingDate: "2023/5/16",
    },
    {
      name: "Mike Smith",
      contact: "(619) 602-6578 X6033",
      bookingDate: "2023/5/16",
    },
    {
      name: "Michael Jon",
      contact: "(619) 602-6578 X6033",
      bookingDate: "2023/5/16",
    },
  ];

  return (
    <div className="w-full h-screen overflow-auto bg-[#F5F7F7] p-10">
      {/* Main container */}
      <div className="flex gap-10">
        {/* Left side: User Profile and General Information */}
        <div className="w-[50%]">
          {/* Profile Picture and Name Container */}
          <div className="bg-white rounded-[18px] p-4 pl-8 mb-6 shadow-lg flex items-center gap-6">
            {/* Profile Picture */}
            <img
              src={user.profilePicture || "https://i.pravatar.cc/100"}
              alt="profile"
              className="w-[100px] h-[100px] rounded-full"
            />
            {/* Profile Name */}
            <h2 className="text-[22px] font-semibold text-black">{`${user?.firstName} ${user?.lastName}`}</h2>
          </div>

          {/* General Information Container */}
          <div className="bg-white rounded-[18px] p-7 shadow-lg">
            <h3 className="font-semibold mb-4 text-black text-[24px]">General Information</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Full Name</span>
                <span className="text-[16px] font-medium text-black">{`${user?.firstName} ${user?.lastName}`}</span>
              </div>
              
              {/* Email Address */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Email Address</span>
                <span className="text-[16px] font-medium text-black">{user?.email}</span>
              </div>
              
              {/* Phone Number */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Phone Number</span>
                <span className="text-[16px] font-medium text-black">+1 856 558 0215</span>
              </div>
              
              {/* MI */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">MI</span>
                <span className="text-[16px] font-medium text-black">{user?.MI || "N/A"}</span>
              </div>
              
              {/* Suffix */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Suffix</span>
                <span className="text-[16px] font-medium text-black">{user?.suffix || "N/A"}</span>
              </div>
              
              {/* Gender */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Gender</span>
                <span className="text-[16px] font-medium text-black">{user?.gender}</span>
              </div>
              
              {/* Patient Date of Birth */}
              <div className="flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Patient Date of Birth</span>
                <span className="text-[16px] font-medium text-black">{new Date(user?.patientDateofBirth).toLocaleDateString()}</span>
              </div>
              
              {/* Address */}
              <div className="col-span-2 flex flex-col bg-[#FAFAFA] p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">Address</span>
                <span className="text-[16px] font-medium text-black">
                  {`${user?.street}, ${user?.city}, ${user?.state}, ${user?.postalCode}, U.S.A.`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Rides Taken */}
        <div className="bg-white rounded-[18px] p-6 w-[50%] h-[50%] shadow-lg">
          <h3 className="font-semibold mb-4 text-black text-[24px]">Rides Taken</h3>
          <table className="w-full">
            <thead>
              <tr className="text-gray-500 text-[14px] text-left">
                <th className="pb-2">Driver Name</th>
                <th className="pb-2">Contact No.</th>
                <th className="pb-2">Booking Date</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((ride, index) => (
                <tr key={index} className="text-gray-900 text-[14px] border-b">
                  <td className="py-3 flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?img=${index + 1}`}
                      alt={ride.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{ride.name}</span>
                  </td>
                  <td className="py-3">{ride?.contact}</td>
                  <td className="py-3">{ride?.bookingDate}</td>
                  <td className="py-3">
                    <Link
                      to={`/ride-details`}
                      className="text-red-500 flex items-center gap-1"
                    >
                      <FiEye className="text-[18px]" />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
