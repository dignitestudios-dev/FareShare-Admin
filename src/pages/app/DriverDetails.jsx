import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserRidesTable from "../../components/app/users/UserRidesTable";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import axios from "../../axios";
import { FaChartLine, FaFilePdf, FaMoneyBillWave, FaStarHalfAlt, FaWallet } from "react-icons/fa";
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
  const [selectedFile, setSelectedFiles] = useState([]);
  const [criminalRecordsToDelete, setCriminalRecordsToDelete] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [criminalRecords, setCriminalRecords] = useState(driver?.criminalRecord || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false)
  const [documents, setDocuments] = useState({
    socialSecurityCardFront: driver?.socialSecurityCardFront || "",
    socialSecurityCardBack: driver?.socialSecurityCardBack || "",
    driverLicenseCardFront: driver?.driverLicenseCardFront || "",
    driverLicenseCardBack: driver?.driverLicenseCardBack || "",
    criminalRecords: driver?.criminalRecord || [], // <-- move criminal records here
    files: {} // store actual File objects for upload
  });
  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;

    if (name === "criminalRecords") {

      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setDocuments(prev => ({
        ...prev,
        criminalRecords: [...prev.criminalRecords, ...newPreviews],
        files: {
          ...prev.files,
          [name]: [...(prev.files[name] || []), ...Array.from(files)]
        }
      }));
    } else {

      setDocuments(prev => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
        files: { ...prev.files, [name]: files[0] }
      }));
    }
  };

  const [formData, setFormData] = useState({
    firstName: driver?.firstName || "",
    lastName: driver?.lastName || "",
    email: driver?.email || "",
    phoneNo: driver?.phoneNo || "",
    MI: driver?.MI || "",
    suffix: driver?.suffix || "",
    SSN: driver?.SSN || "",
    gender: driver?.gender || "",
    dateOfBirth: driver?.dateOfBirth || "",
    driverLicenseNumber: driver?.driverLicenseNumber || "",
    address: `${driver?.street || ""}, ${driver?.city || ""}, ${driver?.state || ""}, ${driver?.zipcode || ""}`,
    preview: driver?.profilePicture || "",
    file: null,
  });

  const toggleBlock = async (isBlocked) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/block", {
        driverId: id,
        blockedReason: reason,
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
  const filteredFeedback = feedback.filter((item) => {
    const fullName =
      `${item?.userId?.firstName} ${item?.userId?.lastName}`.toLowerCase();

    const feedbackDate = new Date(item?.createdAt).toISOString().split("T")[0]; // yyyy-mm-dd format

    const matchesName = fullName.includes(searchText.toLowerCase());
    const matchesDate = dateFilter ? feedbackDate === dateFilter : true;

    return matchesName && matchesDate;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);

  const currentData = filteredFeedback.slice(
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
  const [reason, setReason] = useState("");

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



  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files[0]) {
      setFormData({
        ...formData,
        preview: URL.createObjectURL(files[0]),
        file: files[0],
      });
    } else if (name === "funds") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const isLicenseUpdating =
    documents.files?.driverLicenseCardFront ||
    documents.files?.driverLicenseCardBack;
  const handleSave = async () => {
    // Validation


    // If any license file updated → require both + expiry date
    if (isLicenseUpdating) {

      if (!documents.files?.driverLicenseCardFront || !documents.files?.driverLicenseCardBack) {
        ErrorToast("Upload both license front and back");
        return;
      }

      if (!documents.driverLicenseExpiryDate) {
        ErrorToast("License expiry date required");
        return;
      }
    }

    setEditLoading(true);
    try {
      const form = new FormData();

      // Append normal driver fields
      Object.keys(formData).forEach(key => {
        if (key === "file" && formData.file) form.append("profilePicture", formData.file);
        else if (!["preview", "file", "email", "funds", "phoneNo", "address"].includes(key)) form.append(key, formData[key]);
      });


      Object.keys(documents.files).forEach(key => {
        if (key === "criminalRecords") {
          documents.files[key].forEach(file => form.append("criminalRecords", file));
        } else {
          form.append(key, documents.files[key]);
        }
      });
      if (criminalRecordsToDelete?.length) {
        criminalRecordsToDelete.forEach(url => {
          form.append("criminalRecordsToDelete[]", url);
        });
      }

      if (documents.driverLicenseExpiryDate) {
        form.append("driverLicenseExpiryDate", documents.driverLicenseExpiryDate);
      }

      const { data } = await axios.put(`/admin/driver/profile/${id}`, form);

      if (data?.success) {
        SuccessToast("User updated successfully!");
        setIsEditing(false);

      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Failed to update user.");
    } finally {
      setEditLoading(false);
    }
  };

  const toggleAcceptDriver = async () => {
    try {
      setAcceptDriverLoading(true);
      const { data } = await axios.post("/admin/approveDriver", {
        driverId: JSON.parse(Cookies?.get("driver"))?._id,
        isApproved: true,
        vehicleType: "Standard",

      });
      if (data?.success) {
        setDriverOpen(false);
        navigate("/drivers");
        SuccessToast("Driver Approved Successfully.");
      }


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

        reason:
          "Your Driver Profile failed to meet the FareShare Standards Compliance",
      });
      if (data?.success) {
        setCloseDriverOpen(false);
        navigate("/drivers");
        SuccessToast("Driver Rejected Successfully.");
      }


    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setDeclineLoading(false);
    }
  };
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile.length) {
      ErrorToast("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("driverId", id);
    selectedFile.forEach((file) => {
      formData.append("criminalRecords", file);
    });

    try {
      setUploading(true);
      const response = await axios.post(
        "admin/uploadCriminalRecord",
        formData
      );

      if (response.status === 200) {
        SuccessToast("Files uploaded successfully!");

        setCriminalRecords(prev => [
          ...prev,
          ...selectedFile.map(f => URL.createObjectURL(f))
        ]);
        setSelectedFiles([]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      ErrorToast("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteCriminalRecord = (recordUrl) => {
    // preview se remove
    console.log(recordUrl, "recordUrl")
    setCriminalRecords((prev) => prev.filter((r) => r !== recordUrl));

    // delete list me add
    setCriminalRecordsToDelete((prev) => [...prev, recordUrl]);
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
              setReason={setReason}
              reason={reason}
              isReason={driver?.isBlocked ? false : true}
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
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-red-600 text-white"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  disabled={editLoading}
                  onClick={handleSave}
                  className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-green-600 text-white"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button

                  onClick={() => setIsEditing(false)}
                  className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-red-600 text-white"
                >
                  Cancel
                </button>
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
        {driver?.isBlocked && driver?.blockedReason && (
          <div className="w-full flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">

            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-red-700">
                User Blocked
              </span>
              <p className="text-sm text-red-600 leading-relaxed mt-1">
                {driver.blockedReason}
              </p>
            </div>

          </div>
        )}
        <div className="w-full grid grid-cols-4 justify-start items-start gap-4">
          <div className="w-full h-[198px] rounded-xl bg-gray-100 border p-2 flex items-center justify-center">
            {isEditing ? (
              <input
                type="file"
                name="profilePicture"
                onChange={handleInputChange}
                className="w-full h-full"
              />
            ) : (
              <img
                src={formData.preview}
                alt="Profile"
                className="w-full h-full aspect-square object-contain rounded-lg"
              />
            )}
          </div>
          <div className="w-full col-span-3 grid grid-cols-3 gap-4">
            {[
              { label: "Full Name", name: "firstName", extra: "lastName" },
              { label: "Email Address", name: "email" },
              { label: "Phone Number", name: "phoneNo" },
              { label: "MI", name: "MI" },
              { label: "Suffix", name: "suffix" },
              { label: "Gender", name: "gender" },
              { label: "Date of Birth", name: "dateOfBirth" },
              { label: "SSN", name: "SSN" },
              { label: "Driver License Number", name: "driverLicenseNumber" },
              { label: "Address", name: "address" },
            ].map((field, index) => (
              <div
                key={index}
                className="flex flex-col bg-gray-100 border p-2 rounded-xl"
              >
                <span className="text-[12px] text-[#9E9E9E]">{field.label}</span>
                {isEditing ? (
                  field.name === "email" || field.name === "phoneNo" || field.name === "city" || field.name === "address" ? (

                    <span className="text-[13px] font-medium text-black">
                      {field.name === "funds" ? `$${formData[field.name]}` : formData[field.name]}
                    </span>
                  ) : field.extra ? (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="w-full border rounded p-1 text-[13px]"
                      />
                      <input
                        type="text"
                        name={field.extra}
                        value={formData[field.extra]}
                        onChange={handleInputChange}
                        className="w-full border rounded p-1 text-[13px]"
                      />
                    </div>
                  ) : field.name === "dateOfBirth" ? (
                    <input
                      type="date"
                      name={field.name}
                      value={new Date(formData[field.name]).toISOString().split("T")[0]}
                      onChange={handleInputChange}
                      className="border rounded p-1 text-[13px]"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="border rounded p-1 text-[13px]"
                    />
                  )
                ) : field.extra ? (
                  `${formData[field.name]} ${formData[field.extra]}`
                ) : field.name === "dateOfBirth" ? (
                  new Date(formData[field.name]).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                ) : field.name === "funds" ? (
                  `$${formData[field.name]}`
                ) : field.name === "address" ? (
                  `${driver?.street}, ${driver?.city}, ${driver?.state}, ${driver?.zipcode}, U.S.A.`
                ) : (
                  formData[field.name]
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      <div className="flex justify-between w-full gap-6">

        {/* Earning */}
        <span className="w-full h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-3 items-center">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#E6F4EA] text-[#1E7F43] text-3xl flex items-center justify-center">
            <FaWallet />
          </span>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-black">
              {driver?.wallet != null ? driver.wallet.toFixed(2) : "0.00"}
            </span>
            <span className="text-[14px] text-gray-700">
              Wallet Balance
            </span>
          </div>
        </span>

        {/* Withdraw Amount */}
        <span className="w-full h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-3 items-center">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#FFF4E5] text-[#B45309] text-3xl flex items-center justify-center">
            <FaMoneyBillWave />
          </span>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-black">
              {driver?.approvedWithdrawAmount}
            </span>
            <span className="text-[14px] text-gray-700">
              Withdraw Amount
            </span>
          </div>
        </span>

        {/* Preferability */}
        <span className="w-full h-[88px] rounded-[24px] bg-gray-50 border p-[12px] flex gap-3 items-center">
          <span className="w-[64px] h-[64px] rounded-[18px] bg-[#EEF2FF] text-[#4338CA] text-3xl flex items-center justify-center">
            <FaStarHalfAlt />
          </span>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold text-black">
              {driver?.preferrability ? driver.preferrability * 100 : 0}%
            </span>
            <span className="text-[14px] text-gray-700">
              Preferability
            </span>
          </div>
        </span>

      </div>

      <div className="w-full grid grid-cols-2 gap-4">

        <div className="bg-gray-50 border rounded-3xl p-6 ">
          <h3 className="text-[24px] font-semibold mb-6 text-black">Documents</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Social Security Front", key: "socialSecurityCardFront" },
              { label: "Social Security Back", key: "socialSecurityCardBack" },
              { label: "Driving License Front", key: "driverLicenseCardFront" },
              { label: "Driving License Back", key: "driverLicenseCardBack" },
            ].map((doc) => (
              <div
                key={doc.key}
                className="flex flex-col items-start gap-2 bg-gray-100 border py-6 px-4 rounded-lg"
              >
                <p className="text-[16px] font-semibold text-black">{doc.label}</p>
                <FaFilePdf className="text-red-600 text-[40px]" />
                <div className="flex gap-2 items-center">
                  {documents[doc.key] ? (
                    <a
                      href={documents[doc.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </a>
                  ) : (
                    <span className="text-black">No Document</span>
                  )}
                </div>

                {isEditing && (
                  <input
                    type="file"
                    name={doc.key}
                    onChange={handleDocumentChange}
                    className="text-[10px]"
                  />
                )}
              </div>
            ))}
          </div>


          {isEditing && isLicenseUpdating && (
            <div className="flex gap-4 mt-4">

              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Expiry Date</span>
                <input
                  type="date"
                  name="driverLicenseExpiryDate"
                  value={documents.driverLicenseExpiryDate || ""}
                  onChange={(e) =>
                    setDocuments((prev) => ({
                      ...prev,
                      driverLicenseExpiryDate: e.target.value,
                    }))
                  }
                  className="border rounded p-1 text-[13px]"
                />
              </div>

            </div>
          )}
        </div>
        <div className="bg-gray-50 border rounded-3xl p-6 h-[400px] overflow-auto">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-2xl font-semibold text-gray-800">
              Upload Criminal Record
            </h3>

            <button
              onClick={() => {
                if (!selectedFile.length) {
                  document.getElementById("fileUpload").click();
                } else {
                  handleUpload();
                }
              }}
              disabled={uploading}
              className={`w-[200px] py-2 rounded-xl text-white font-semibold transition
      ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-[#c00000] hover:bg-red-700"}`}
            >
              {uploading
                ? "Uploading..."
                : selectedFile.length > 0
                  ? `Upload ${selectedFile.length} Document(s)`
                  : "Browse Document(s)"}
            </button>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
            multiple // allow multiple files
          />



          {/* File Preview */}
          {criminalRecords?.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {criminalRecords?.map((record, index) => (
                  <div
                    key={index}
                    className="relative flex items-center gap-4 bg-white border py-4 px-4 rounded-lg shadow-sm"
                  >
                    {/* CROSS BUTTON */}
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteCriminalRecord(record)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}

                    <FaFilePdf className="text-red-600 text-4xl" />

                    <div>
                      <p className="text-gray-800 font-medium">
                        Criminal Record {index + 1}
                      </p>
                      <button
                        onClick={() => window.open(record)}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        View Document
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* SINGLE BUTTON */}


        </div>


        {/* Customer Feedback Section */}
      </div>
      <div className="bg-gray-50 rounded-3xl w-full border p-6 ">
        <h3 className="text-[24px] font-semibold mb-6 text-black">
          Customer Feedback
        </h3>
        {feedback?.length > 0 ? (
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by customer name"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-lg w-full"
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border px-3 py-2 rounded-lg"
            />
          </div>
        ) : null}
        {feedback?.length > 0 ? (
          currentData?.map((user, index) => (
            <>
              <div
                key={index}
                className="mb-2 bg-gray-100 border p-3 rounded-xl"
              >
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
            </>
          ))
        ) : (
          <div className="w-full min-h-52 col-span-2 flex flex-col items-center justify-center">
            <img src="/no-data.png" alt="" className="w-[150px]" />
            <span className="font-semibold text-center text-[#0e0e10] text-[20px] ">
              You don’t have added any <br /> Listing Here
            </span>
          </div>
        )}

        {feedback?.length > 0 && (
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
                class={`min-h-[38px] min-w-[38px]  flex hover:bg-gray-100 justify-center items-center  text-gray-800 ${currentPage === i + 1
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
        )}
      </div>

      {/* Vehicles Section */}
      <div className="bg-gray-50 border w-full rounded-3xl p-6 ">
        <h3 className="text-[24px] font-semibold mb-6 text-black">Vehicles</h3>
        <div className="grid grid-cols-4 gap-4">
          {vehicles?.length > 0 ? (
            vehicles?.map((vehicle, index) => (
              <div
                key={index}
                className="bg-gray-100 border  relative rounded-2xl p-4"
              >
                <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-[12px] px-2 py-1 rounded-md">
                  {new Date(vehicle?.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </div>
                {console.log(vehicle?.updatedAt, "vehicle")}
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
                        localStorage.setItem("vehicle", JSON.stringify(vehicle)); // safe for big objects
                        localStorage.setItem("title", "Vehicle Approval");
                        navigate(`/vehicle-approval/${vehicle?._id}`, {
                          state: vehicleLoading,
                        });
                        console.log(vehicle, "Testtt")
                      }}
                      className="text-white cursor-pointer w-[26px] h-[26px] bg-[#9F9F9F]  rounded-[8px] flex items-center justify-center hover:bg-blue-600"
                    >
                      <FiEye className="h-4 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full min-h-52 col-span-4 flex flex-col items-center justify-center">
              <img src="/no-data.png" alt="" className="w-[150px]" />
              <span className="font-semibold text-center text-[#0e0e10] text-[20px] ">
                You don’t have added any <br /> Listing Here
              </span>
            </div>
          )}

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
