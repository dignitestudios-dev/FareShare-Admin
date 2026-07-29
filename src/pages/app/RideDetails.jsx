import React, { useState, useEffect, useRef } from "react";
import { AiOutlineCalendar } from "react-icons/ai"; // Calendar icon
import { FaCar, FaRegClock, FaRegUser } from "react-icons/fa6";
import axios, { baseUrl } from "../../axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";

import { initSocket } from "../../contexts/SocketContext";

const RideDetails = () => {
  const { id } = useParams();
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rideDetail = location?.state;
  console.log("this is ride detail--> ", rideDetail)
  const [searchQuery, setSearchQuery] = useState("");
  const [rides, setRides] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [fundloading, setFundLoading] = useState(false);
  const [roleType, setRoleType] = useState('')
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  const getRides = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/admin/rides/${id}`);
      setRides(data?.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRides();
  }, []);

  useEffect(() => {
    const socket = initSocket();
    if (!socket) return;

    socketRef.current = socket;


    socket.emit("adminJoin");


    socket.on("updateLocationResponse", (data) => {
      if (data?.success && data?.data?.rideId === id) {
        const [lng, lat] = data.data.coordinates;
        console.log([lng, lat], "lng, lat")
        setDriverLocation({ lat: Number(lat), lng: Number(lng) });

      }
    });

    socket.on("reachedLocationResponse", (data) => {
      console.log("Socket Event: reachedLocationResponse", data);
      getRides();
    });

    socket.on("rideAccepted", (data) => {
      console.log("Socket Event: rideAccepted", data);
      getRides();
    });

    socket.on("rideStarted", (data) => {
      console.log("Socket Event: rideStarted", data);
      getRides();
    });

    socket.on("rideCompleted", (data) => {
      console.log("Socket Event: rideCompleted", data);
      getRides();
      setDirections(null);
    });

    socket.on("rideCancelled", (data) => {
      console.log("Socket Event: rideCancelled", data);
      getRides();
      setDirections(null);
    });

    socket.on("connect_error", (err) => console.error("Socket connect_error:", err));
    socket.on("connect_timeout", () => console.warn("Socket connect_timeout"));

    return () => socket.disconnect();
  }, [id]);


  useEffect(() => {
    if (!rides?.ride) return;

    if (rides.ride.currentLocation?.coordinates) {
      const [lng, lat] = rides?.ride?.currentLocation?.coordinates;
      setPickupLocation({ lat: Number(lat), lng: Number(lng) });
    }

    if (rides.ride.destination?.coordinates) {
      const [lng, lat] = rides.ride.destination.coordinates;
      setDestinationLocation({ lat: Number(lat), lng: Number(lng) });
    }
  }, [rides]);


  useEffect(() => {
    if (!pickupLocation || !destinationLocation) return;

    const status = rides?.ride?.status;

    let origin = null;
    let destination = null;

    if (status === "active") {
      setDirections(null);
      return;
    } else if (status === "driverAssigned") {
      origin = driverLocation || pickupLocation;
      destination = pickupLocation;
    } else if (status === "inProgress") {
      origin = driverLocation || pickupLocation;
      destination = destinationLocation;
    } else {
      setDirections(null);
      return;
    }

    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) setDirections(result);
          else setDirections(null);
        }
      );
    }
  }, [driverLocation, pickupLocation, destinationLocation, rides?.ride?.status]);






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
    if (!isoString) return null;

    // Direct time extraction from string (e.g., "2026-07-29T15:16:36.348Z" -> 15:16 -> 3:16 PM)
    const timeMatch = String(isoString).match(/T?(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }

    const date = new Date(isoString);
    if (isNaN(date)) {
      return null;
    }

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

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

  const handleAddFund = async () => {
    if (!amount) return ErrorToast("Enter Amount");

    setFundLoading(true);

    const payload = {
      rideId: id,
      type: roleType,
      amount: Number(amount),
    };

    if (roleType === 'user') {
      payload.userId = rides?.user?.id;
    } else if (roleType === 'driver') {
      payload.driverId = rides?.driver?.id;
    }

    try {
      const response = await axios.post("admin/funds/add", payload);
      if (response?.status === 200) {
        SuccessToast(response?.data?.message);
        setAmount("");
        setOpen(false);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setFundLoading(false);
    }
  };

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

            <div className="flex justify-between items-center mb-4 gap-2">
              <p className="text-[15px] text-gray-500 font-semibold shrink-0">ID Number</p>
              <p className="text-[15px] text-black font-semibold text-right break-all">
                {rides?.id}
              </p>
            </div>

            {/* Location Info */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex flex-col items-center justify-center mt-1.5 shrink-0">
                <div className="bg-red-500 w-[10px] h-[10px] rounded-full"></div>
                <div className="bg-gray-300 w-[2px] h-[24px] my-1"></div>
                <div className="bg-green-600 w-[10px] h-[10px] rounded-full"></div>
              </div>
              <div className="flex flex-col gap-2 w-full min-w-0">
                <div>
                  <p className="text-[13px] text-gray-400 font-medium">Start Location</p>
                  <p className="text-black font-semibold text-[14px] leading-tight break-words">
                    {rides?.ride?.originAddress || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-gray-400 font-medium">End Location</p>
                  <p className="text-black font-semibold text-[14px] leading-tight break-words">
                    {rides?.ride?.destinationAddress || "N/A"}
                  </p>
                </div>
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
                  ${rides?.ride?.baseRate != null && !isNaN(Number(rides.ride.baseRate)) ? Number(rides.ride.baseRate).toFixed(2) : "0.00"}
                </p>
              </div>
              <div className=" w-full flex justify-between items-center">
                <p className="text-[15px] text-black font-semibold">Per Mile</p>
                <p className="text-[15px]  text-red-500 font-semibold">
                  ${rides?.ride?.costPerMile != null && !isNaN(Number(rides.ride.costPerMile)) ? Number(rides.ride.costPerMile).toFixed(2) : "0.00"}
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
                  ${rides?.ride?.fare != null && !isNaN(Number(rides.ride.fare)) ? Number(rides.ride.fare).toFixed(2) : "0.00"}
                </p>
              </div>
              {!rides?.ride?.isWalletPay && (

                <>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-[15px] text-black font-semibold">
                      Total Fare (Before Stripe)
                    </p>
                    <p className="text-[15px] text-black font-semibold">
                      $
                      {(rides?.ride?.stripeNet + rides?.ride?.stripeFee).toFixed(2)}
                    </p>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <p className="text-[15px] text-black font-semibold">
                      Stripe Fee
                    </p>
                    <p className="text-[15px] text-red-500 font-semibold">
                      ${rides?.ride?.stripeFee != null && !isNaN(Number(rides.ride.stripeFee)) ? Number(rides.ride.stripeFee).toFixed(2) : "0.00"}
                    </p>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <p className="text-[15px] text-black font-semibold">
                      Net Fare (After Stripe)
                    </p>
                    <p className="text-[15px] text-green-600 font-semibold">
                      ${rides?.ride?.stripeNet != null && !isNaN(Number(rides.ride.stripeNet)) ? Number(rides.ride.stripeNet).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-[15px] text-black font-semibold">
                      Card Number
                    </p>

                    <p className="text-[15px] text-blue-900 font-semibold">
                      {rides?.ride?.cardBrand
                        ? `${rides?.ride?.cardBrand} •••• ${rides?.ride?.cardLast4}`
                        : "No card"}
                    </p>
                  </div>
                </>
              )}
              {rides?.ride?.isWalletPay && (
                <>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-[15px] text-black font-semibold">
                      Used Credits
                    </p>

                    <p className="text-[15px] text-blue-900 font-semibold">
                      {rides?.ride?.walletPayAmount != null && !isNaN(Number(rides.ride.walletPayAmount))
                        ? `$${Number(rides.ride.walletPayAmount).toFixed(2)}`
                        : "not Found"}
                    </p>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <p className="text-[15px] text-black font-semibold">
                      Available Credits
                    </p>

                    <p className="text-[15px] text-blue-900 font-semibold">
                      {rides?.user?.totalFunds != null && !isNaN(Number(rides.user.totalFunds))
                        ? `$${Number(rides.user.totalFunds).toFixed(2)}`
                        : "$0.00"}
                    </p>
                  </div>
                </>

              )}


            </div>
          </div>

          <div className="w-full grid grid-cols-1 gap-4 justify-start items-start">
            {/* Driver Info Card */}
            <div className="w-full flex flex-col justify-start items-start gap-3 bg-gray-50 border rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between w-full items-center border-b pb-3">
                <h3 className="text-[16px] font-bold text-black">
                  Driver Info
                </h3>
                <button
                  onClick={() => {
                    setOpen(true);
                    setRoleType('driver');
                  }}
                  className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold transition bg-[#c00000] hover:bg-red-700 shadow-sm"
                >
                  Add Funds
                </button>
              </div>

              <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      rides?.driver?.profilePicture ||
                      "https://placehold.co/400"
                    }
                    alt="driver profile"
                    className="w-14 h-14 rounded-full object-cover shrink-0 border"
                  />
                  <div className="min-w-0 flex flex-col">
                    <h2 className="text-[16px] font-bold text-black truncate">
                      {rides?.driver?.name || "N/A"}
                    </h2>
                    <p className="text-[14px] text-gray-600 truncate">
                      {rides?.driver?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-white border rounded-xl p-3 mt-1">
                <h4 className="text-[13px] font-semibold text-gray-500 mb-1">
                  Driver Feedback
                </h4>
                <p className="text-sm text-gray-800 break-words">
                  {rides?.feedback?.driverReview?.review?.trim()
                    ? rides.feedback.driverReview.review
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* User Info Card */}
            <div className="w-full flex flex-col justify-start items-start gap-3 bg-gray-50 border rounded-3xl p-5 shadow-sm">
              <div className="flex justify-between w-full items-center border-b pb-3">
                <h3 className="text-[16px] font-bold text-black">
                  User Info
                </h3>
                <button
                  onClick={() => {
                    setOpen(true);
                    setRoleType('user');
                  }}
                  className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold transition bg-[#c00000] hover:bg-red-700 shadow-sm"
                >
                  Add Funds
                </button>
              </div>

              <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      rides?.user?.profilePicture || "https://placehold.co/400"
                    }
                    alt="user profile"
                    className="w-14 h-14 rounded-full object-cover shrink-0 border"
                  />
                  <div className="min-w-0 flex flex-col">
                    <h2 className="text-[16px] font-bold text-black truncate">
                      {rides?.user?.name || "N/A"}
                    </h2>
                    <p className="text-[14px] text-gray-600 truncate">
                      {rides?.user?.email || "N/A"}
                    </p>
                    <p className="text-[13px] text-gray-800 truncate">
                      <span className="text-[#c00000] font-semibold">Insurance #</span>{" "}
                      {rides?.user?.insuranceNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full bg-white border rounded-xl p-3 mt-1">
                <h4 className="text-[13px] font-semibold text-gray-500 mb-1">
                  User Feedback
                </h4>
                <p className="text-sm text-gray-800 break-words">
                  {rides?.feedback?.userReview?.review?.trim()
                    ? rides.feedback.userReview.review
                    : "N/A"}
                </p>
              </div>
            </div>
            <div>
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
          {rides?.ride?.status !== "cancelled" && rides?.ride?.status !== "completed" && (
            <div className="bg-gray-50 border rounded-3xl p-6">
              <h3 className="text-[22px] font-semibold mb-4 text-black">
                Ride Route Map
              </h3>

              {(pickupLocation || destinationLocation) && (
                <GoogleMap
                  center={driverLocation || pickupLocation}
                  zoom={12}
                  mapContainerStyle={{ width: "100%", height: "400px" }}
                >

                  {pickupLocation && <Marker position={pickupLocation} label="P" />}
                  {destinationLocation && <Marker position={destinationLocation} label="D" />}


                  {driverLocation && <Marker position={driverLocation} label="🚗" />}


                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: "#c00000",
                          strokeWeight: 5,
                        },
                      }}
                    />
                  )}

                </GoogleMap>
              )}

            </div>

          )}

          {Object.keys(rideDetail?.vehicle || {}).length > 0 ? (
            <div className="bg-gray-50 border rounded-3xl p-6">
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
                      rideDetail.vehicle.vehicleImageFront ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Vehicle"
                    className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                  />
                </SwiperSlide>

                <SwiperSlide>
                  <img
                    src={
                      rideDetail.vehicle.vehicleImageRear ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Vehicle"
                    className="w-full h-[259px] rounded-[16px] object-cover mb-4"
                  />
                </SwiperSlide>

                {/* Remaining SwiperSlides */}
              </Swiper>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 border rounded-lg p-2 min-w-0 w-full">
                  <p className="text-[14px] text-gray-500 font-medium w-full break-words">Make</p>
                  <p className="text-[16px] font-medium text-black w-full break-words break-all">
                    {rideDetail.vehicle.vehicleMake || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-100 border rounded-lg p-2 min-w-0 w-full">
                  <p className="text-[14px] text-gray-500 font-medium w-full break-words">Vehicle Type</p>
                  <p className="text-[16px] font-medium text-black w-full break-words break-all">
                    {rideDetail.vehicle.vehicleType || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-100 border rounded-lg p-2 min-w-0 w-full">
                  <p className="text-[14px] text-gray-500 font-medium w-full break-words">Name</p>
                  <p className="text-[16px] font-medium text-black w-full break-words break-all">
                    {rideDetail.vehicle.vehicleName || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-100 border rounded-lg p-2 min-w-0 w-full">
                  <p className="text-[14px] text-gray-500 font-medium w-full break-words">Model Year</p>
                  <p className="text-[16px] font-medium text-black w-full break-words break-all">
                    {rideDetail.vehicle.modelYear || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-100 border rounded-lg p-2 min-w-0 w-full">
                  <p className="text-[14px] text-gray-500 font-medium w-full break-words">Plate Number</p>
                  <p className="text-[16px] font-medium text-black w-full break-words break-all">
                    {rideDetail.vehicle.plateNumber || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-100 border rounded-lg p-2 min-w-0 w-full">
                  <p className="text-[14px] text-gray-500 font-medium w-full break-words">Wheelchair Accessible</p>
                  <p className="text-[16px] font-medium text-black w-full break-words break-all">
                    {(rideDetail?.vehicle?.isWheelChairAccessible ?? rideDetail?.vehicle?.isWheelchairAccessible) ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-3xl p-6 flex items-center justify-center h-[400px]">
              <p className="text-gray-500 text-lg font-medium">
                Vehicle details not available.
              </p>
            </div>
          )}



        </div>
      </div>
      <div className="bg-gray-50 border rounded-3xl p-6 mt-4">
        <h3 className="text-[22px] font-semibold mb-4 text-black">
          Chat History
        </h3>
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto p-2">
          {/* Check if there are any messages at all */}
          {(!rides?.chatHistories ||
            rides.chatHistories.every(
              (chat) => chat?.messages?.length === 0
            )) && (
              <p className="text-black text-center">No chat history available.</p>
            )}

          {rides?.chatHistories?.map((chat) =>
            chat?.messages?.map((msg) => {
              const isUser = msg.user.id === rides?.user?.id; // true if message is from rider
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "justify-start" : "justify-end"
                    }`}
                >
                  {/* Left: show profile for user */}
                  {isUser && (
                    <img
                      src={msg.user.profilePicture || "https://placehold.co/50"}
                      alt={msg.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-2xl max-w-xs ${isUser
                      ? "bg-blue-100 text-black rounded-bl-none"
                      : "bg-green-100 text-black rounded-tr-none"
                      }`}
                  >
                    <p className="text-sm font-semibold">{msg.user.name}</p>
                    <p className="text-sm">{msg.msg}</p>
                  </div>

                  {/* Right: show profile for driver */}
                  {!isUser && (
                    <img
                      src={msg.user.profilePicture || "https://placehold.co/50"}
                      alt={msg.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {
        open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[350px]">
              <h3 className="text-lg font-semibold mb-4">
                Add Ride Amount
              </h3>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow only positive values
                  if (value === "" || Number(value) >= 0) {
                    setAmount(value);
                  }
                }}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddFund}
                  disabled={fundloading}
                  className="px-4 py-2 rounded-lg bg-[#c00000] text-white"
                >
                  {fundloading ? "Adding..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default RideDetails;
