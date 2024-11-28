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

  const [isBlocked, setIsBlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleBlock = async (isBlocked) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/admin/block", {
        userId: id,
        isBlocked: isBlocked,
      });
      if (data?.success) {
        setLoading(false);
        setOpen(false);
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
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-4">
      <div className="w-full h-auto bg-gray-50 border rounded-3xl p-4 flex flex-col justify-start items-start ">
        <div className="w-full flex items-center  mb-4 justify-between h-8 ">
          <h3 className="font-semibold text-black text-[24px]">
            General Information
          </h3>
          {user?.isBlocked ? (
            <button
              onClick={() => {
                setOpen(true);
                setIsBlocked(false);
              }}
              className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#6eff49] text-black"
            >
              {"Unblock"}
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(true);
                setIsBlocked(true);
              }}
              className="w-auto px-3 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#1c1c1c] text-white"
            >
              {"Block"}
            </button>
          )}
        </div>
        <BlockModal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          onConfirm={() => toggleBlock(isBlocked)}
          loading={loading}
          isBlocked={isBlocked}
        />
        <div className="w-full grid grid-cols-4 justify-start items-start gap-4">
          <div className="w-full h-[198px] rounded-xl bg-gray-100 border  p-2">
            <img
              src={user?.profilePicture}
              alt=""
              className="w-full h-full aspect-square object-contain rounded-lg"
            />
          </div>
          <div className="w-full col-span-3 grid grid-cols-3 gap-4">
            {/* Full Name */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Full Name</span>
              <span className="text-[13px] font-medium text-black">{`${user?.firstName} ${user?.lastName}`}</span>
            </div>

            {/* Email Address */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Email Address</span>
              <span className="text-[13px] font-medium text-black">
                {user?.email}
              </span>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Phone Number</span>
              <span className="text-[13px] font-medium text-black">
                {user?.phoneNo}
              </span>
            </div>

            {/* MI */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">MI</span>
              <span className="text-[13px] font-medium text-black">
                {user?.MI || "N/A"}
              </span>
            </div>

            {/* Suffix */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Suffix</span>
              <span className="text-[13px] font-medium text-black">
                {user?.suffix || "N/A"}
              </span>
            </div>

            {/* Gender */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Gender</span>
              <span className="text-[13px] font-medium text-black">
                {user?.gender}
              </span>
            </div>

            {/* Patient Date of Birth */}
            <div className="flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Date of Birth</span>
              <span className="text-[13px] font-medium text-black">
                {new Date(user?.patientDateofBirth).toLocaleDateString()}
              </span>
            </div>

            {/* Address */}
            <div className="col-span-2 flex flex-col bg-gray-100 border p-2 rounded-xl">
              <span className="text-[12px] text-[#9E9E9E]">Address</span>
              <span className="text-[13px] font-medium text-black">
                {`${user?.street}, ${user?.city}, ${user?.state}, ${user?.postalCode}, U.S.A.`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <UserRidesTable user={user} />
    </div>
  );
};

export default UserDetails;
