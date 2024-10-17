import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { IoCheckmark } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import axios from "../../axios";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";
import VehicleAcceptModal from "./VehicleAcceptModal";
import VehicleRejectModal from "./VehicleRejectModal";
import { ErrorToast, SuccessToast } from "../../components/global/Toast";

const VehicleApproveDetails = () => {
  const { id } = useParams(); // Get vehicle ID from URL parameters
  const [vehicle, setVehicle] = useState(null); // State to hold vehicle details
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    //   const fetchVehicleDetails = async () => {
    //     try {
    //       const { data } = await axios.get(`/admin/vehicle/${id}`); // Fetch vehicle details
    //       setVehicle(data?.data); // Store the fetched vehicle data
    //     } catch (error) {
    //       console?.error("Error fetching vehicle details:", error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   fetchVehicleDetails();

    setVehicle(JSON.parse(Cookies.get("vehicle")));
  }, [id]); // Fetch details when ID changes

  const handleProfileClick = () => {
    navigate("/driver-details-page"); // Navigate to the driver details page
  };

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
          navigate("/vehicle-approval");
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
        navigate("/vehicle-approval");
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
    <div className="w-full h-full bg-[#F5F7F7] p-10 overflow-auto">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: Vehicle Details */}
        <div className="bg-white h-full rounded-[18px] p-6 shadow-lg cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[24px] font-bold leading-[32px] text-black">
              Vehicle Details
            </h3>
            <div className="flex gap-2">
              {/* Reject Button */}
              <button
                onClick={() => setCloseOpen(true)}
                className=" text-white bg-[#FF3E46] w-[120px] h-[37px] flex items-center justify-center  rounded-[8px] gap-1 "
              >
                <IoMdClose className="text-[20px] mb-0.5" />
                <span className="text-[14px] font-normal leading-none">
                  Reject
                </span>
              </button>

              {/* Approve Button */}
              <button
                onClick={() => setOpen(true)}
                className=" text-white bg-[#00DC67] w-[120px] h-[37px] flex items-center justify-center  rounded-[8px] gap-1 "
              >
                <IoCheckmark className="text-[20px] mb-0.5" />
                <span className="text-[14px] font-normal leading-none">
                  Approve
                </span>
              </button>
            </div>
          </div>
          <Swiper
            spaceBetween={10}
            pagination={true}
            modules={[Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img
                src={
                  vehicle?.vehicleImageFront ||
                  "https://via.placeholder.com/300"
                }
                alt="Vehicle"
                className="w-full h-[259px] rounded-[16px] object-cover mb-4"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={
                  vehicle?.vehicleImageRear || "https://via.placeholder.com/300"
                }
                alt="Vehicle"
                className="w-full h-[259px] rounded-[16px] object-cover mb-4"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={
                  vehicle?.vehicleImagePassengerSide ||
                  "https://via.placeholder.com/300"
                }
                alt="Vehicle"
                className="w-full h-[259px] rounded-[16px] object-cover mb-4"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={
                  vehicle?.vehicleImageDriverSide ||
                  "https://via.placeholder.com/300"
                }
                alt="Vehicle"
                className="w-full h-[259px] rounded-[16px] object-cover mb-4"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={
                  vehicle?.vehicleImageInteriorFront ||
                  "https://via.placeholder.com/300"
                }
                alt="Vehicle"
                className="w-full h-[259px] rounded-[16px] object-cover mb-4"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={
                  vehicle?.vehicleImageInteriorBack ||
                  "https://via.placeholder.com/300"
                }
                alt="Vehicle"
                className="w-full h-[259px] rounded-[16px] object-cover mb-4"
              />
            </SwiperSlide>
          </Swiper>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAFAFA] flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Make
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.vehicleMake}
              </p>
            </div>
            <div className="bg-[#FAFAFA] flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Name
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.vehicleName}
              </p>
            </div>
            <div className="bg-[#FAFAFA] flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Model Year
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.modelYear}
              </p>
            </div>
            <div className="bg-[#FAFAFA] flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Plate Number
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.plateNumber}
              </p>
            </div>
            <div className="bg-[#FAFAFA] flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Wheelchair Accessible
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.isWheelChairAccessible ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Driver Profile */}
        <div className="space-y-6">
          {/* Driver Info */}
          <div
            className="flex items-center bg-white rounded-[18px] p-6 shadow-lg"
            onClick={handleProfileClick}
          >
            <img
              src={vehicle?.driverId?.profilePicture}
              alt="profile"
              className="w-[75px] h-[75px] rounded-full cursor-pointer"
            />
            <div className="ml-4 flex items-start gap-1 flex-col justify-start">
              <h2 className="text-[20px] font-semibold leading-[25.5px] text-[#252525]">
                {vehicle?.driverId?.firstName} {vehicle?.driverId?.lastName}
              </h2>
              <p className="text-[16px] font-normal leading-[16px] text-[#252525]">
                {vehicle?.driverId?.email}
              </p>
            </div>
          </div>

          {/* Ride Detail */}
          {/* Additional ride details can go here */}
        </div>

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
  );
};

export default VehicleApproveDetails;
