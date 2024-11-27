import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserRidesTable from "../../components/app/users/UserRidesTable";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import axios from "../../axios";
import { FaFilePdf } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Cookies from "js-cookie";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";
import VehicleAcceptModal from "../../components/app/vehicle_approval/VehicleAcceptModal";
import VehicleRejectModal from "../../components/app/vehicle_approval/VehicleRejectModal";
import { MdCheck, MdClose } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import DriverAcceptModal from "../../components/app/driver/DriverAcceptModal";
import DriverRejectModal from "../../components/app/driver/DriverRejectModal";
import BlockModal from "../../components/app/global/BlockModal";

const DriverDetails = () => {
  const location = useLocation();
  const driver = location?.state;
  const navigate = useNavigate();
  const { id } = useParams();

  const [isBlocked, setIsBlocked] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleBlock = async (isBlocked) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/block", {
        driverId: id,
        isBlocked: isBlocked,
      });
      if (data?.success) {
        setLoading(false);
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
      setLoading(false);
    }
  };

  const [feedback, setFeedback] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);

  const getFeedback = async () => {
    try {
      setFeedLoading(true);
      const { data } = await axios.get(
        `/feedback/driver/${id}?page=1&limit=1000`
      );
      setFeedback(data?.data); // Use the data from the API response
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setFeedLoading(false);
    }
  };

  const [vehicles, setVehicles] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  const getVehicle = async () => {
    try {
      setVehicleLoading(true);
      const { data } = await axios.get(
        `/admin/vehicle/driver/${id}?page=1&limit=1000`
      );
      setVehicles(data?.data); // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.log("Error:", error);
    } finally {
      setVehicleLoading(false);
    }
  };

  useEffect(() => {
    getFeedback();
    getVehicle();
  }, []);

  // pagination related data:

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(feedback.length / itemsPerPage);

  const currentData = feedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // VEhcile accept decline

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
          localStorage.setItem("title", "Vehicle Approval");
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
        localStorage.setItem("title", "Vehicle Approval");
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

  // Driver accept decline:
  const [driverOpen, setDriverOpen] = useState(false);
  const [acceptDriverLoading, setAcceptDriverLoading] = useState(false);
  const [declineDriverLoading, setDeclineDriverLoading] = useState(false);

  const [closeDriverOpen, setCloseDriverOpen] = useState(false);

  const toggleAcceptDriver = async () => {
    try {
      setAcceptDriverLoading(true);
      const { data } = await axios.post("/admin/approveDriver", {
        driverId: JSON.parse(Cookies?.get("driver"))?._id,
        isApproved: true,
        vehicleType: "Standard",
        // reason: "Documents are incorrect",
      });
      if (data?.success) {
        setDriverOpen(false);
        navigate("/drivers");
        SuccessToast("Driver Approved Successfully.");
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const toggleDeclineDriver = async () => {
    try {
      setDeclineDriverLoading(true);

      const { data } = await axios.post("/admin/approveDriver", {
        driverId: JSON.parse(Cookies?.get("driver"))?._id,
        isApproved: false,
        // vehicleType: "Standard",
        reason:
          "Your Driver Profile failed to meet the FareShare Standards Compliance",
      });
      if (data?.success) {
        setCloseDriverOpen(false);
        navigate("/drivers");
        SuccessToast("Driver Rejected Successfully.");
      }

      // Use the data from the API response
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeclineLoading(false);
    }
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-4">
      <div className="w-full h-auto bg-gray-50 border rounded-3xl p-4 flex flex-col justify-start items-start ">
        <div className="w-full flex items-center  mb-4 justify-between h-8 ">
          <h3 className="font-semibold text-black text-[24px]">
            General Information
          </h3>

          <div className="w-auto flex gap-1 justify-start items-center">
            <BlockModal
              isOpen={openBlock}
              onRequestClose={() => setOpenBlock(false)}
              onConfirm={() => toggleBlock(isBlocked)}
              loading={loading}
              isBlocked={isBlocked}
            />
            {driver?.status?.toLowerCase() == "approved" ? (
              <>
                {driver?.isBlocked ? (
                  <button
                    onClick={() => {
                      setOpenBlock(true);
                      setIsBlocked(false);
                    }}
                    className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#6eff49] text-black"
                  >
                    {"Unblock"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setOpenBlock(true);
                      setIsBlocked(true);
                    }}
                    className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
                  >
                    {"Block"}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCloseDriverOpen(true);
                    Cookies.set("driver", JSON.stringify(driver));
                  }}
                  className="bg-red-500 text-white w-[26px] h-[26px] flex items-center justify-center  rounded-[8px] hover:bg-red-600"
                >
                  <MdClose className="w-5 h-5" />
                </button>
                {/* Approve button */}
                <button
                  onClick={() => {
                    setDriverOpen(true);
                    Cookies.set("driver", JSON.stringify(driver));
                  }}
                  className="bg-green-500 text-white w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-green-600"
                >
                  <MdCheck className="w-5 h-5" />
                </button>
                {driver?.isBlocked ? (
                  <button
                    disabled={loading}
                    onClick={() => toggleBlock(false)}
                    className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#6eff49] text-black"
                  >
                    {loading ? "Loading" : "Unblock"}
                  </button>
                ) : (
                  <button
                    disabled={loading}
                    onClick={() => toggleBlock(true)}
                    className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
                  >
                    {loading ? "Loading" : "Block"}
                  </button>
                )}
              </>
            )}

            <DriverAcceptModal
              isOpen={driverOpen}
              onRequestClose={() => setDriverOpen(false)}
              onConfirm={() => toggleAcceptDriver()}
              loading={acceptDriverLoading}
            />

            {/* Reject Modal */}
            <DriverRejectModal
              isOpen={closeDriverOpen}
              onRequestClose={() => setCloseDriverOpen(false)}
              onConfirm={() => toggleDeclineDriver()}
              loading={declineDriverLoading}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-4 justify-start items-start gap-4">
          <div className="w-full h-[268px] rounded-xl bg-gray-100 border  p-2">
            <img
              src={driver?.profilePicture}
              alt=""
              className="w-full h-full aspect-square object-contain rounded-lg"
            />
          </div>
          <div className="w-full col-span-3 grid grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Full Name</span>
              <span className="text-[13px] font-medium text-black">{`${driver?.firstName} ${driver?.lastName}`}</span>
            </div>

            {/* Email Address */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Email Address</span>
              <span className="text-[13px] font-medium text-black">
                {driver?.email}
              </span>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Phone Number</span>
              <span className="text-[13px] font-medium text-black">
                {driver?.phoneNo}
              </span>
            </div>

            {/* MI */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">MI</span>
              <span className="text-[13px] font-medium text-black">
                {driver?.MI || "N/A"}
              </span>
            </div>

            {/* Suffix */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Suffix</span>
              <span className="text-[13px] font-medium text-black">
                {driver?.suffix || "N/A"}
              </span>
            </div>

            {/* Gender */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Gender</span>
              <span className="text-[13px] font-medium text-black">
                {driver?.gender}
              </span>
            </div>

            {/* Patient Date of Birth */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">
                Patient Date of Birth
              </span>
              <span className="text-[13px] font-medium text-black">
                {new Date(driver?.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">SSN</span>
              <span className="text-[13px] font-medium text-black">
                {driver?.ssn}
              </span>
            </div>

            {/* Patient Date of Birth */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">
                Driver License Number
              </span>
              <span className="text-[13px] font-medium text-black">
                {driver?.driverLicenseNumber}
              </span>
            </div>

            {/* Address */}
            <div className="col-span-3 flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Address</span>
              <span className="text-[13px] font-medium text-black">
                {`${driver?.street}, ${driver?.city}, ${driver?.state}, ${driver?.postalCode}, U.S.A.`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        {/* Documents Section */}
        <div className="bg-gray-50 border rounded-3xl  p-6 ">
          <h3 className="text-[24px] font-semibold mb-6 text-black">
            Documents
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Social Security Front",
                icon: driver?.socialSecurityCardFront,
              },
              {
                label: "Social Security Back",
                icon: driver?.socialSecurityCardBack,
              },
              {
                label: "Driving License Front",
                icon: driver?.driverLicenseCardFront,
              },
              {
                label: "Driving License Back",
                icon: driver?.driverLicenseCardBack,
              },
            ].map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-100 border py-6 px-4 rounded-lg"
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
        {/* Customer Feedback Section */}
        <div className="bg-gray-50 rounded-3xl border p-6 ">
          <h3 className="text-[24px] font-semibold mb-6 text-black">
            Customer Feedback
          </h3>

          {currentData?.map((user, index) => (
            <div key={index} className="mb-2 bg-gray-100 border p-3 rounded-xl">
              <div className="flex items-center gap-4">
                <img
                  src={user?.userId?.profilePicture}
                  alt="Customer"
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div>
                  <p className="text-[16px] font-semibold text-black">
                    {user?.userId?.firstName} {user?.userId?.lastName}
                  </p>{" "}
                  {/* Replace with actual data */}
                  <div className="flex items-center text-gray-600">
                    {user?.userId?.email}
                  </div>
                </div>
              </div>
              <p className="text-gray-800 text-[14px] mt-2">
                {user?.feedback || "N/A"}
              </p>
            </div>
          ))}

          <nav
            class="flex items-center  justify-end mt-2 -space-x-px"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={() =>
                goToPage(currentPage > 1 ? currentPage - 1 : currentPage)
              }
              class="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
                class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${
                  currentPage === i + 1
                    ? " border bg-[#c00000] text-white hover:bg-[#c00000] "
                    : "border bg-gray-100"
                }    py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-none  disabled:opacity-50 disabled:pointer-events-none `}
                aria-current="page"
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() =>
                goToPage(
                  currentPage < totalPages ? currentPage + 1 : currentPage
                )
              }
              class="min-h-[38px] min-w-[38px] py-2 bg-gray-100 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm first:rounded-s-xl last:rounded-e-xl border  text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
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
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="bg-gray-50 border w-full rounded-3xl p-6 ">
        <h3 className="text-[24px] font-semibold mb-6 text-black">Vehicles</h3>
        <div className="grid grid-cols-4 gap-4">
          {vehicles?.map((vehicle, index) => (
            <div
              key={index}
              className="bg-gray-100 border  relative rounded-2xl p-4"
            >
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
                    className="w-full h-[140px] rounded-xl object-cover mb-4"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={
                      vehicle?.vehicleImageRear ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Vehicle"
                    className="w-full h-[140px] rounded-xl object-cover mb-4"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={
                      vehicle?.vehicleImagePassengerSide ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Vehicle"
                    className="w-full h-[140px] rounded-xl object-cover mb-4"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={
                      vehicle?.vehicleImageDriverSide ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Vehicle"
                    className="w-full h-[140px] rounded-xl object-cover mb-4"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={
                      vehicle?.vehicleImageInteriorFront ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Vehicle"
                    className="w-full h-[140px] rounded-xl object-cover mb-4"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={
                      vehicle?.vehicleImageInteriorBack ||
                      "https://via.placeholder.com/300"
                    }
                    alt="Vehicle"
                    className="w-full h-[140px] rounded-xl object-cover mb-4"
                  />
                </SwiperSlide>
              </Swiper>

              <div className="flex justify-between items-start">
                <div className="mt-2">
                  <p className="text-[14px] text-gray-500">Vehicle Make:</p>
                  <p className="text-[16px] font-medium text-black">
                    {vehicle?.vehicleMake}
                  </p>{" "}
                  {/* Replace with actual data */}
                </div>
                <div className="mt-2">
                  <p className="text-[14px] text-gray-500">Vehicle Name:</p>
                  <p className="text-[16px] font-medium text-black">
                    {vehicle?.vehicleName}
                  </p>{" "}
                  {/* Replace with actual data */}
                </div>

                {/* Replace with actual data */}
              </div>
              <div className="flex justify-between items-start">
                <div className="mt-2">
                  <p className="text-[14px] text-gray-500">Model Year:</p>
                  <p className="text-[16px] font-medium text-black">
                    {vehicle?.modelYear}
                  </p>{" "}
                  {/* Replace with actual data */}
                </div>
                <div className="mt-2">
                  <p className="text-[14px] text-gray-500">Plate Number:</p>
                  <p className="text-[16px] font-medium text-black">
                    {vehicle?.plateNumber}
                  </p>{" "}
                  {/* Replace with actual data */}
                </div>
              </div>

              <div
                className={`grid grid-cols-2  
                    justify-between
                 gap-2 items-start`}
              >
                <div className="mt-2">
                  <p className="text-[14px] text-gray-500">Wheelchair:</p>
                  <p className="text-[16px] font-medium text-black">
                    {vehicle?.isWheelChairAccessible ? "Yes" : "No"}
                  </p>{" "}
                  {/* Replace with actual data */}
                </div>

                <div className="w-auto flex justify-center mt-4 items-end gap-1">
                  {vehicle?.status?.toLowerCase() == "approved" ? (
                    <button
                      onClick={() => {
                        setCloseOpen(true);
                        Cookies.set("vehicle", JSON.stringify(vehicle));
                      }}
                      className="bg-red-500 text-white cursor-pointer w-[26px] h-[26px] flex items-center justify-center  rounded-[8px] hover:bg-red-600"
                    >
                      <MdClose className="w-5 h-5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCloseOpen(true);
                          Cookies.set("vehicle", JSON.stringify(vehicle));
                        }}
                        className="bg-red-500 text-white cursor-pointer w-[26px] h-[26px] flex items-center justify-center  rounded-[8px] hover:bg-red-600"
                      >
                        <MdClose className="w-5 h-5" />
                      </button>
                      {/* Approve button */}
                      <button
                        onClick={() => {
                          setOpen(true);
                          Cookies.set("vehicle", JSON.stringify(vehicle));
                        }}
                        className="bg-green-500 text-white cursor-pointer w-[26px] h-[26px] flex items-center justify-center rounded-[8px] hover:bg-green-600"
                      >
                        <MdCheck className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* View button */}
                  <div
                    onClick={() => {
                      navigate(`/vehicle-approval/${vehicle?._id}`, {
                        state: vehicleLoading,
                      });
                      Cookies.set("vehicle", JSON.stringify(vehicle));
                      localStorage.setItem("title", "Vehicle Approval");
                    }}
                    className="text-white cursor-pointer w-[26px] h-[26px] bg-[#9F9F9F]  rounded-[8px] flex items-center justify-center hover:bg-blue-600"
                  >
                    <FiEye className="h-4 w-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}

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
    </div>
  );
};

export default DriverDetails;
