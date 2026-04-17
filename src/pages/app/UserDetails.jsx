import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserRidesTable from "../../components/app/users/UserRidesTable";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import axios from "../../axios";
import BlockModal from "../../components/app/global/BlockModal";

const UserDetails = () => {
  const location = useLocation();
  const user = location?.state;
  const navigate = useNavigate();
  const { id } = useParams();
  function convertToMMDDYYYY(dateString) {
    if (dateString == null) return "Invalid Date";
    const date = new Date(dateString);
    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  const [isBlocked, setIsBlocked] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "", // still here
    phoneNo: user?.phoneNo || "",
    MI: user?.MI || "",
    suffix: user?.suffix || "",
    gender: user?.gender || "",
    patientDateofBirth: user?.patientDateofBirth || "",
    street: user?.street || "",
    city: user?.city || "",
    state: user?.state || "",
    postalCode: user?.postalCode || "",
    funds: user?.funds || 0, // still here
    preview: user?.profilePicture || "",
    file: null,
  });
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
  const handleSave = async () => {
    setEditLoading(true);

    try {
      setLoading(true);
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "file" && formData.file) {
          form.append("profilePicture", formData.file);
        } else if (
          key !== "preview" &&
          key !== "file" &&
          key !== "email" &&
          key !== "funds" &&
          key !== "phoneNo"
        ) {
          form.append(key, formData[key]);
        }
      });

      const { data } = await axios.put(`/admin/user/${id}`, form);

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
  const toggleBlock = async (isBlocked) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/block", {
        userId: id,

        blockedReason: reason,
        isBlocked: isBlocked,
      });
      if (data?.success) {
        setLoading(false);
        setOpen(false);
        navigate("/users");
        SuccessToast(
          isBlocked
            ? "User blocked Successfully."
            : "User Unblocked Successfully.",
        );
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(user, "user---detail");

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-4">
      <div className="w-full h-auto bg-gray-50 border rounded-3xl p-4 flex flex-col justify-start items-start ">
        <div className="w-full flex items-center  mb-4 justify-between h-8 ">
          <div className="flex gap-2 justify-end ms-auto">
            {/* Block/Unblock Button */}
            {isBlocked ? (
              <button
                onClick={() => {
                  setOpen(true);
                  setIsBlocked(false);
                }}
                className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#6eff49] text-black"
              >
                Unblock
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(true);
                  setIsBlocked(true);
                }}
                className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
              >
                Block
              </button>
            )}

            {/* Edit Button */}
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
          </div>
        </div>

        {/* Blocked Warning */}
        {user?.isBlocked && user?.blockedReason && (
          <div className="w-full flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-red-700">
                User Blocked
              </span>
              <p className="text-sm text-red-600 leading-relaxed mt-1">
                {user.blockedReason}
              </p>
            </div>
          </div>
        )}

        <BlockModal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          onConfirm={() => toggleBlock(isBlocked)}
          loading={loading}
          isBlocked={isBlocked}
          setReason={setReason}
          reason={reason}
          isReason={user?.isBlocked ? false : true}
        />

        {/* User Info */}
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
                src={formData.preview || "/person.png"}
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
              { label: "Date of Birth", name: "patientDateofBirth" },
              { label: "Street", name: "street" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Postal Code", name: "postalCode" },
              { label: "Wallet Balance", name: "funds" },
            ].map((field, index) => (
              <div
                key={index}
                className="flex flex-col bg-gray-100 border p-2 rounded-xl"
              >
                <span className="text-[12px] text-[#9E9E9E]">
                  {field.label}
                </span>
                {isEditing ? (
                  field.name === "email" ||
                  field.name === "funds" ||
                  field.name === "phoneNo" ||
                  field.name === "city" ||
                  field.name === "street" ||
                  field.name === "state" ||
                  field.name === "postalCode" ? (
                    <span className="text-[13px] font-medium text-black">
                      {field.name === "funds"
                        ? `$${formData[field.name]}`
                        : formData[field.name]}
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
                  ) : field.name === "patientDateofBirth" ? (
                    <input
                      type="date"
                      name={field.name}
                      value={
                        new Date(formData[field.name])
                          .toISOString()
                          .split("T")[0]
                      }
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
                ) : field.name === "patientDateofBirth" ? (
                  new Date(formData[field.name]).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                ) : field.name === "funds" ? (
                  `$${formData[field.name]}`
                ) : (
                  formData[field.name]
                )}
              </div>
            ))}
          </div>
        </div>
        {user?.nemtEligibility && (
          <div className="w-full mt-5 bg-gray-50  rounded-3xl border p-6 h-auto  mb-6">
            <h3 className="font-bold mb-4 text-black text-[24px]">
              Eligibility Verification
            </h3>
            <div className="w-full grid grid-cols-3 gap-6">
              {/* Eligibility from date */}
              <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Eligibility from date
                </span>
                <span className="text-[16px] font-medium text-black">
                  {convertToMMDDYYYY(user?.nemtEligibility?.eligiblityFormDate)}
                </span>
              </div>

              {/* Eligibility through Date */}
              <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Eligibility through Date
                </span>
                <span className="text-[16px] font-medium text-black">
                  {convertToMMDDYYYY(
                    user?.nemtEligibility?.eligiblityThroughDate,
                  )}
                </span>
              </div>

              {/* Insurance Carrier */}
              <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Insurance Carrier
                </span>
                <span className="text-[16px] font-medium text-black">
                  {user?.nemtEligibility?.insuranceCarrier}
                </span>
              </div>

              {/* Medicaid No./Insurance No. */}
              <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Medicaid No./Insurance No.
                </span>
                <span className="text-[16px] font-medium text-black">
                  {user?.nemtEligibility?.insuranceNumber}
                </span>
              </div>

              {/* Subscriber Number */}
              <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Subscriber Number
                </span>
                <span className="text-[16px] font-medium text-black">
                  {user?.nemtEligibility?.subscriberNumber}
                </span>
              </div>

              {/* Social Security Number */}
              <div className="flex flex-col bg-gray-100 border p-4 rounded-lg">
                <span className="text-[14px] text-[#9E9E9E]">
                  Social Security Number
                </span>
                <span className="text-[16px] font-medium text-black">
                  {user?.nemtEligibility?.socialSecurityNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-5 rounded-xl bg-gray-100 border p-5 mt-5">
          <h3 className="text-[20px] font-bold text-black">
            Identity Card Documents
          </h3>
          <div className="w-full flex items-center justify-center">
            {user?.identityCardDocumentFront && (
              <div className="w-fit h-[320px] flex items-center justify-center">
                <img
                  src={user?.identityCardDocumentFront}
                  alt="Profile"
                  className="w-full h-full aspect-square object-contain rounded-lg"
                />
              </div>
            )}

            {user?.identityCardDocumentBack && (
              <div className="w-fit h-[320px] flex items-center justify-center">
                <img
                  src={user?.identityCardDocumentBack}
                  alt="Profile"
                  className="w-full h-full aspect-square object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 rounded-xl bg-gray-100 border p-5 mt-5">
          <h3 className="text-[20px] font-bold text-black">
            Reasons to End the Ride
          </h3>

          <ul className="list-disc pl-4">
            <li>Driver being verbally abusive <span className="font-bold">(0)</span></li>
            <li>Driver being physically abusive <span className="font-bold">(0)</span></li>
            <li>Other <span className="font-bold">(0)</span></li>
          </ul>
        </div>
      </div>

      <UserRidesTable user={user} />
    </div>
  );
};

export default UserDetails;
