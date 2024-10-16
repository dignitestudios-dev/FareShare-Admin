import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { IoCheckmark } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import axios from "../../axios";

const VehicleApproveDetails = () => {
  const { id } = useParams(); // Get vehicle ID from URL parameters
  const [vehicle, setVehicle] = useState(null); // State to hold vehicle details
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const { data } = await axios.get(`/admin/vehicle/${id}`); // Fetch vehicle details
        setVehicle(data?.data); // Store the fetched vehicle data
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]); // Fetch details when ID changes

  const handleProfileClick = () => {
    navigate("/driver-details-page"); // Navigate to the driver details page
  };

  if (loading) {
    return <div>Loading...</div>; // Simple loading state
  }

  if (!vehicle) {
    return <div>No vehicle found.</div>; // Handle case where no vehicle is found
  }

  return (
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: Vehicle Details */}
        <div className="bg-white h-full rounded-[18px] p-6 shadow-lg cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[22px] font-semibold text-black">Vehicle Details</h3>
            <div className="flex gap-4">
              {/* Reject Button */}
              <button className="flex items-center text-white bg-[#FF3E46] px-6 py-2 rounded-lg gap-2">
                <IoMdClose size={20} />
                <span>Reject</span>
              </button>

              {/* Approve Button */}
              <button className="flex items-center text-white bg-[#00DC67] px-6 py-2 rounded-lg gap-2">
                <IoCheckmark size={20} />
                <span>Approve</span>
              </button>
            </div>
          </div>
          <img
            src={vehicle.vehicleImageFront || "https://via.placeholder.com/300"}
            alt="Vehicle"
            className="w-full h-[200px] rounded-lg object-cover mb-4"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAFAFA] rounded-lg p-2">
              <p className="text-[14px] text-black">Make</p>
              <p className="text-[16px] font-medium text-black">{vehicle.vehicleMake}</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-lg p-2">
              <p className="text-[14px] text-black">Name</p>
              <p className="text-[16px] font-medium text-black">{vehicle.vehicleName}</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-lg p-2">
              <p className="text-[14px] text-black">Model Year</p>
              <p className="text-[16px] font-medium text-black">{vehicle.modelYear}</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-lg p-2">
              <p className="text-[14px] text-black">Plate Number</p>
              <p className="text-[16px] font-medium text-black">{vehicle.plateNumber}</p>
            </div>
            <div className="bg-[#FAFAFA] rounded-lg p-2">
              <p className="text-[14px] text-black">Wheelchair Accessible</p>
              <p className="text-[16px] font-medium text-black">{vehicle.isWheelChairAccessible ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Driver Profile */}
        <div className="space-y-6">
          {/* Driver Info */}
          <div className="flex items-center bg-white rounded-[18px] p-6 shadow-lg" onClick={handleProfileClick}>
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="profile"
              className="w-[70px] h-[70px] rounded-full cursor-pointer"
            />
            <div className="ml-4">
              <h2 className="text-[18px] font-semibold text-black">Mike Smith</h2>
              <p className="text-sm text-gray-500">mikesmith12@gmail.com</p>
            </div>
          </div>

          {/* Ride Detail */}
          {/* Additional ride details can go here */}
        </div>
      </div>
    </div>
  );
};

export default VehicleApproveDetails;
