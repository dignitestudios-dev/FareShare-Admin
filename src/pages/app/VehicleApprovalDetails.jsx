import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { IoCheckmark } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import axios from "../../axios";
import Cookies from "js-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";

import VehicleAcceptModal from "../../components/app/vehicle_approval/VehicleAcceptModal";
import VehicleRejectModal from "../../components/app/vehicle_approval/VehicleRejectModal";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import { FaFilePdf } from "react-icons/fa";

const VehicleApprovalDetails = () => {
  const { id } = useParams(); // Get vehicle ID from URL parameters
  const [vehicle, setVehicle] = useState(null); // State to hold vehicle details
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setVehicle(JSON.parse(Cookies.get("vehicle")));
  }, [id]); // Fetch details when ID changes

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
    <div className="w-full h-auto  ">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Side: Vehicle Details */}
        <div className="bg-gray-50 border  h-full rounded-3xl p-6 cursor-pointer">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[24px] font-bold leading-[32px] text-black">
              Vehicle Details
            </h3>
            <div className="w-auto flex justify-start items-center gap-1">
              {vehicle?.status?.toLowerCase() == "approved" ? (
                <button
                  onClick={() => setCloseOpen(true)}
                  className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#c00000] text-white"
                >
                  {"Decline"}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setCloseOpen(true)}
                    className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#c00000] text-white"
                  >
                    {"Decline"}
                  </button>
                  <button
                    onClick={() => setOpen(true)}
                    className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
                  >
                    {"Approve"}
                  </button>
                </>
              )}
            </div>
          </div>
          <Swiper
            spaceBetween={10}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
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
            <div className="bg-gray-100 border flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Make
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.vehicleMake}
              </p>
            </div>
            <div className="bg-gray-100 border flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Name
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.vehicleName}
              </p>
            </div>
            <div className="bg-gray-100 border flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Vehicle Type
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.vehicleType || "N/A"}
              </p>
            </div>
            <div className="bg-gray-100 border flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Model Year
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.modelYear}
              </p>
            </div>
            <div className="bg-gray-100 border flex flex-col gap-2 justify-start items-start rounded-lg p-2">
              <p className="text-[14px] font-medium leading-[20px] text-[#9E9E9E]">
                Plate Number
              </p>
              <p className="text-[16px] font-normal leading-[20px] text-black">
                {vehicle?.plateNumber}
              </p>
            </div>
            <div className="bg-gray-100 border flex flex-col gap-2 justify-start items-start rounded-lg p-2">
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
          <div className="flex items-center bg-gray-50 border rounded-3xl  p-6 ">
            <img
              src={
                vehicle?.driverId?.profilePicture
                  ? vehicle?.driverId?.profilePicture
                  : "https://placehold.co/400"
              }
              alt="profile"
              className="w-[75px] h-[75px] rounded-full cursor-pointer"
            />
            <div className="ml-4 flex items-start gap-1 flex-col justify-start">
              <h2 className="text-[20px] font-semibold leading-[25.5px] text-[#252525]">
                {vehicle?.driverId?.firstName && vehicle?.driverId?.lastName
                  ? `${vehicle?.driverId?.firstName} ${vehicle?.driverId?.lastName}`
                  : "N/A"}
              </h2>
              <p className="text-[16px] font-normal leading-[16px] text-[#252525]">
                {vehicle?.driverId?.email ? vehicle?.driverId?.email : "N/A"}
              </p>
            </div>
          </div>
          {/* document */}
          <div className="bg-gray-50 border rounded-3xl p-6 ">
            <h3 className="text-[24px] font-semibold mb-6 text-black">
              Documents
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Registration",
                  icon: vehicle?.vehicleRegistrationCard,
                },
                {
                  label: "Proof of Insurance",
                  icon: vehicle?.proofInsurance,
                },
              ].map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-100 border p-4 rounded-lg"
                >
                  <FaFilePdf className="text-red-600 text-[40px]" />
                  <div>
                    <p className="text-[16px] font-semibold text-black">
                      {doc?.label}
                    </p>
                    {doc?.icon !== "insurance-doc-link" ? (
                      <a
                        className="text-blue-500 cursor-pointer"
                        href={doc?.icon}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      <span className="text-black">No Document</span>
                    )}
                  </div>
                </div>
              ))}
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

export default VehicleApprovalDetails;
