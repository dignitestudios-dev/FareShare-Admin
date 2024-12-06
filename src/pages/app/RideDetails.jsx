import React, { useState, useEffect } from "react";
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon
import { FaCar, FaRegClock, FaRegUser } from "react-icons/fa6";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import { FaStarHalfAlt } from "react-icons/fa";
// import required modules
import { Pagination, Autoplay } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import { FiDollarSign } from "react-icons/fi";
import BlockModal from "../../components/app/global/BlockModal";

const RideDetails = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rides, setRides] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const getRides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/admin/rides/${id}`);
      setRides(data?.data); // Use the data from the API response
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRides();
  }, []);

  function formatISODate(isoString) {
    const options = { weekday: "short", month: "short", day: "numeric" };
    const date = new Date(isoString);

    // Check if the date is valid
    if (isNaN(date)) {
      return null; // or handle the error as needed
    }

    return date.toLocaleDateString("en-US", options);
  }

  function formatISOTime(isoString) {
    const date = new Date(isoString);

    // Check if the date is valid
    if (isNaN(date)) {
      return null; // or handle the error as needed
    }

    // Get hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always be two digits
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Return the formatted time
    return `${hours}:${formattedMinutes} ${ampm}`;
  }
  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
      case "driverAssigned":
        return "bg-blue-500/10 border border-blue-500 text-blue-500";
      case "scheduled":
        return "bg-yellow-500/10 border border-yellow-500 text-yellow-500";
      case "completed":
      case "reachedDestination":
        return "bg-green-500/10 border border-green-500 text-green-500";
      case "cancelled":
        return "bg-red-500/10 border border-red-500 text-red-500";
      default:
        return "bg-gray-500/10 border border-gray-500 text-gray-500"; // Default style
    }
  };
  const formatStatus = (status) => {
    return status
      ? status.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()
      : status;
  };

  const [userLoading, setUserLoading] = useState(false);
  const [driverLoading, setDriverLoading] = useState(false);

  const toggleUserBlock = async (isBlocked, id) => {
    try {
      setUserLoading(true);
      const { data } = await axios.post("/admin/block", {
        userId: id,
        isBlocked: isBlocked,
      });
      if (data?.success) {
        setUserLoading(false);
        localStorage.setItem("title", "Users");

        navigate("/users");
        SuccessToast(
          isBlocked
            ? "User blocked Successfully."
            : "User Unblocked Successfully."
        );
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };

  const toggleDriverBlock = async (isBlocked, id) => {
    try {
      setDriverLoading(true);
      const { data } = await axios.post("/admin/block", {
        driverId: id,
        isBlocked: isBlocked,
      });
      if (data?.success) {
        setDriverLoading(false);
        localStorage.setItem("title", "Drivers");
        navigate("/drivers");
        SuccessToast(
          isBlocked
            ? "Driver blocked Successfully."
            : "Driver Unblocked Successfully."
        );
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.log(error);
    } finally {
      setDriverLoading(false);
    }
  };

  const [userOpen, setUserOpen] = useState(false);
  const [driverOpen, setDriverOpen] = useState(false);

  return (
    <div className="w-full h-auto  ">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: Ride Details */}
        <div className="space-y-4 h-auto">
          <div className="bg-gray-50 border h-auto max-h-auto rounded-3xl p-6 ">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[22px] font-semibold text-black">
                Ride Detail
              </h3>
              <span
                className={`px-3 py-1 capitalize rounded-full ${getStatusStyles(
                  rides?.ride?.status
                )} `}
              >
                {formatStatus(rides?.ride?.status)}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-[17px] text-black font-semibold">ID Number</p>
              <p className="text-[17px] text-black font-semibold">
                {rides?.id}
              </p>
            </div>

            {/* Location Info */}
            <div className="flex items-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-red-500 mb-3 w-[8px] h-[8px] rounded-full"></div>
                <div className="bg-gray-300 w-[6px] h-[6px] rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-[14px] text-gray-500">Start Location</p>
                <p className="text-black font-semibold">
                  {rides?.ride?.originAddress}
                </p>
              </div>
            </div>

            {/* End Location */}
            <div className="flex items-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-gray-300 mb-3 w-[6px] h-[6px] rounded-full"></div>
                <div className="bg-red-500 w-[8px] h-[8px] rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-[14px] text-gray-500">End Location</p>
                <p className="text-black font-semibold">
                  {" "}
                  {rides?.ride?.destinationAddress}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <AiOutlineCalendar className="text-red-500" />
                <p className="text-black font-semibold">
                  {formatISODate(rides?.ride?.rideDate)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FaRegClock className="text-red-500" />
                <p className="text-black font-semibold">
                  {" "}
                  {formatISOTime(rides?.ride?.rideDate)}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col justify-start items-start gap-1 mt-4">
              <div className=" w-full flex justify-between items-center">
                <p className="text-[15px] text-black font-semibold">
                  Base Rate
                </p>
                <p className="text-[15px]  text-red-500 font-semibold">
                  ${rides?.ride?.baseRate}
                </p>
              </div>
              <div className=" w-full flex justify-between items-center">
                <p className="text-[15px] text-black font-semibold">Per Mile</p>
                <p className="text-[15px]  text-red-500 font-semibold">
                  ${rides?.ride?.costPerMile}
                </p>
              </div>

              <div className=" w-full flex justify-between items-center">
                <p className="text-[15px] text-black font-semibold">
                  Miles Travelled
                </p>
                <p className="text-[15px]  text-red-500 font-semibold">
                  {rides?.ride?.miles}
                </p>
              </div>

              {/* Fare Info */}
              <div className=" w-full flex justify-between items-center">
                <p className="text-[15px] text-black font-semibold">Fare</p>
                <p className="text-[15px]  text-red-500 font-semibold">
                  ${rides?.ride?.fare}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 gap-4 justify-start items-start">
            <div className="w-full flex flex-col justify-start items-start gap-2 bg-gray-50 border rounded-3xl p-4">
              <h3 className="text-[16px] font-semibold text-black">
                Driver Info
              </h3>
              <div className="w-full flex items-center justify-between  ">
                <div className="flex items-center">
                  <img
                    src={
                      rides?.driver?.profilePicture ||
                      "https://placehold.co/400"
                    }
                    alt="profile"
                    className="w-[70px] h-[70px] rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="text-[18px] font-semibold text-black">
                      {rides?.driver?.name || "N/A"}
                    </h2>
                    <p className="text-[16px] text-black">
                      {rides?.driver?.email || "N/A"}
                    </p>
                  </div>
                </div>
                {/* <div>
              <h3 className="text-[14px] capitalize font-semibold text-[#A2A2A2]">
                {rides?.ride?.rideType}
              </h3>
            </div> */}
              </div>

              <>
                <h3 className="text-[16px] font-semibold text-black">
                  Driver Feedback
                </h3>
                <div className="w-full flex items-center text-sm text-gray-700 justify-between  ">
                  {rides?.feedback?.driverReview?.review?.trim()
                    ? rides.feedback.driverReview.review
                    : "N/A"}
                </div>
              </>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2 bg-gray-50 border rounded-3xl p-4">
              <h3 className="text-[16px] font-semibold text-black">
                User Info
              </h3>
              <div className="w-full flex items-center justify-between  ">
                <div className="flex items-center">
                  <img
                    src={
                      rides?.user?.profilePicture || "https://placehold.co/400"
                    }
                    alt="profile"
                    className="w-[70px] h-[70px] rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="text-[18px] font-semibold text-black">
                      {rides?.user?.name}
                    </h2>
                    <p className="text-[16px] text-black">
                      {rides?.user?.email}
                    </p>
                    <p className="text-[16px] text-black">
                      <span className="text-[#c00000]">Insurance #</span>{" "}
                      {rides?.user?.insuranceNumber || "N/A"}
                    </p>
                  </div>
                </div>
                {/* <div>
              <h3 className="text-[14px] capitalize font-semibold text-[#A2A2A2]">
                {rides?.ride?.rideType}
              </h3>
            </div> */}
              </div>
              <>
                <h3 className="text-[16px] font-semibold text-black">
                  User Feedback
                </h3>
                <div className="w-full flex items-center text-sm text-gray-700 justify-between  ">
                  {rides?.feedback?.userReview?.review?.trim()
                    ? rides.feedback.userReview.review
                    : "N/A"}
                </div>
              </>
            </div>
          </div>
        </div>

        {/* Right Side: Driver Profile & Vehicle Info */}
        <div className="space-y-4">
          <div className="w-full  grid grid-cols-2  justify-start items-start gap-2 lg:gap-6 ">
            <span className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start">
              <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E9FAFF] text-[#35CFFF] text-2xl flex items-center justify-center">
                <FaStarHalfAlt />
              </span>
              <div className="w-auto flex flex-col justify-start items-start">
                <span className="text-[18px] font-bold text-black">
                  {rides?.feedback?.userReview?.preferredAgain == true
                    ? "Yes"
                    : "No"}
                </span>
                <span className="text-black text-[14px] font-normal">
                  User Preferred
                </span>
              </div>
            </span>

            <span className="w-full  h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-2 items-center justify-start">
              <span className="w-[64px] h-[64px] rounded-[18px] bg-[#0074B633] text-[#0041A4] text-2xl flex items-center justify-center">
                <FaStarHalfAlt />
              </span>
              <div className="w-auto flex flex-col justify-start items-start">
                <span className="text-[18px] font-bold text-black">
                  {rides?.feedback?.driverReview?.preferredAgain == true
                    ? "Yes"
                    : "No"}
                </span>{" "}
                <span className="text-black text-[14px] font-normal">
                  Driver Preferred
                </span>
              </div>
            </span>
          </div>
          {/* Vehicle Detail */}
          <div className="bg-gray-50 border rounded-3xl p-6 ">
            <h3 className="text-[22px] font-semibold mb-6 text-black">
              Vehicle Details
            </h3>
            <Swiper
              spaceBetween={10}
              modules={[Pagination, Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              className="mySwiper"
            >
              <SwiperSlide>
                <img
                  src={
                    rides?.vehicle?.vehicleImageFront ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Vehicle"
                  className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={
                    rides?.vehicle?.vehicleImageRear ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Vehicle"
                  className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={
                    rides?.vehicle?.vehicleImagePassengerSide ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Vehicle"
                  className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={
                    rides?.vehicle?.vehicleImageDriverSide ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Vehicle"
                  className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={
                    rides?.vehicle?.vehicleImageInteriorFront ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Vehicle"
                  className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src={
                    rides?.vehicle?.vehicleImageInteriorBack ||
                    "https://via.placeholder.com/300"
                  }
                  alt="Vehicle"
                  className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                />
              </SwiperSlide>
            </Swiper>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 border rounded-lg p-2">
                <p className="text-[14px] text-black">Make</p>
                <p className="text-[16px] font-medium text-black">
                  {rides?.vehicle?.vehicleMake || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 border rounded-lg p-2">
                <p className="text-[14px] text-black">Vehicle Type</p>
                <p className="text-[16px] font-medium text-black">
                  {rides?.vehicle?.vehicleType || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 border rounded-lg p-2">
                <p className="text-[14px] text-black">Name</p>
                <p className="text-[16px] font-medium text-black">
                  {rides?.vehicle?.vehicleName || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 border rounded-lg p-2">
                <p className="text-[14px] text-black">Model Year</p>
                <p className="text-[16px] font-medium text-black">
                  {rides?.vehicle?.modelYear || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 border rounded-lg p-2">
                <p className="text-[14px] text-black">Plate Number</p>
                <p className="text-[16px] font-medium text-black">
                  {rides?.vehicle?.plateNumber || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 border rounded-lg p-2">
                <p className="text-[14px] text-black">Wheelchair Accessible</p>
                <p className="text-[16px] font-medium text-black">
                  {rides?.vehicle?.isWheelchairAccessible ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {rides?.ride?.status == "cancelled" && (
            <div className="bg-gray-50 border rounded-3xl p-6 ">
              <h3 className="text-[22px] font-semibold mb-6 text-black">
                Cancellation Reason
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-100 border rounded-lg p-2 relative">
                  {rides?.user?.id && (
                    <button
                      onClick={() => setUserOpen(true)}
                      className="w-24 px-3 h-7 rounded-md absolute top-2 right-2 flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
                    >
                      {"Block User"}
                    </button>
                  )}
                  <p className="text-[14px] text-black">User</p>
                  <p className="text-[16px] font-medium text-black">
                    {rides?.ride?.cancelledBy == "user" &&
                    rides?.ride?.cancellationReason[0]
                      ? rides?.ride?.cancellationReason[0]
                      : "Automated Cancellation - No Driver Found."}
                  </p>
                </div>

                <BlockModal
                  isOpen={userOpen}
                  onRequestClose={() => setUserOpen(false)}
                  onConfirm={() => toggleUserBlock(true, rides?.user?.id)}
                  loading={userLoading}
                  isBlocked={true}
                />
                <div className="bg-gray-100 border rounded-lg p-2 relative">
                  {rides?.driver?.id && (
                    <button
                      onClick={() => setDriverOpen(true)}
                      className="w-24 px-3 h-7 rounded-md absolute top-2 right-2 flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
                    >
                      {"Block Driver"}
                    </button>
                  )}

                  <BlockModal
                    isOpen={driverOpen}
                    onRequestClose={() => setDriverOpen(false)}
                    onConfirm={() => toggleDriverBlock(true, rides?.driver?.id)}
                    loading={driverLoading}
                    isBlocked={true}
                  />

                  <p className="text-[14px] text-black">Driver</p>
                  <p className="text-[16px] font-medium text-black">
                    {rides?.ride?.cancelledBy == "driver" &&
                    rides?.ride?.cancellationReason[0]
                      ? rides?.ride?.cancellationReason[0]
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
