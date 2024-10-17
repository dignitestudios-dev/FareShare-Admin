import React, { useContext } from "react";
import { Forgot, Logo } from "../../assets/export"; // Add FareShare logo here
import AuthInput from "../../components/onboarding/AuthInput";
import AuthSubmitBtn from "../../components/onboarding/AuthSubmitBtn";
import { GlobalContext } from "../../contexts/GlobalContext";
import { BiArrowBack } from "react-icons/bi";

const ForgotPassword = () => {
  const { navigate } = useContext(GlobalContext);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-start items-start px-8 py-[44px] lg:px-[111px]">
        {/* Logo */}
        <img
          src={Logo}
          alt="FareShare Logo"
          className="self-start  w-[155px] mb-8"
        />
        <div className="flex flex-col justify-start items-start w-full h-full mt-14">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black self-start mb-4"
          >
            <BiArrowBack className="text-2xl" />
          </button>

          <h1 className="text-[32px] lg:text-[36px] font-bold leading-[59.22px] text-black">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-[12px] lg:text-[14px] font-normal leading-[22.18px]  mb-8">
            Enter your registered email address to recover your password.
          </p>

          <form
            onSubmit={() => navigate("/verify-otp")}
            className="w-[448px]  flex flex-col gap-4"
          >
            <AuthInput text="Email Address" type="email" />
            <AuthSubmitBtn
              text="Next"
              className="bg-red-600 text-white w-full py-3"
            />
          </form>
        </div>
      </div>

      {/* Right side: Illustration */}
      <div className="hidden h-full lg:flex w-1/2 bg-[#FBFBFB] justify-center items-center">
        <img
          src={Forgot}
          alt="Forgot Password Illustration"
          className="w-[415px] "
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
