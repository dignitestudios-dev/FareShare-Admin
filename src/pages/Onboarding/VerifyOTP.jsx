import React, { useContext } from "react";
import AuthSubmitBtn from "../../components/onboarding/AuthSubmitBtn";
import { GlobalContext } from "../../contexts/GlobalContext";
import { BiArrowBack } from "react-icons/bi";
import AuthInput from "../../components/onboarding/AuthInput";
import { Forgot, Logo } from "../../assets/export"; // Add FareShare logo here

const VerifyOTP = () => {
  const { navigate } = useContext(GlobalContext);
  const arr = [1, 2, 3, 4, 5, 6];

  return (
    <div className="w-screen h-screen flex">
      {/* Left Side: Form */}
      <form
        onSubmit={() => navigate("/reset-password")}
        className="w-full lg:w-1/2 h-full bg-white px-4 py-8 lg:p-20 z-10 flex flex-col overflow-y-auto justify-start items-center gap-8"
      >
        {/* Logo */}
        <img src={Logo} alt="FareShare Logo" className="self-start w-[150px] mb-8" /> 

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full flex justify-start items-start flex-col"
        >
          <BiArrowBack className="text-3xl text-black" />
        </button>

        {/* Title and Description */}
        <div className="w-full flex justify-start items-start flex-col">
          <h1 className="text-[48px] font-bold text-black leading-[64.8px] tracking-[-1.2px]">
            Verification
          </h1>
          <p className="font-normal text-[16px] text-[#868686] leading-[21.6px] tracking-[-1.2px]">
            Enter verification code sent to your email
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="w-full h-auto flex justify-start items-center gap-4">
          {arr.map((item) => {
            return (
              <input
                key={item}
                className="w-[50px] h-[60px] rounded-2xl bg-transparent outline-none text-center border-[1px] border-[#c2c6cb] text-black text-2xl focus:border-[#55C9FA]"
              />
            );
          })}
        </div>

        {/* Resend Code */}
        <div className="w-full flex flex-col">
          <div className="w-full lg:w-[434px] flex justify-left items-left -mt-4">
            <span className="text-[13px] font-medium text-[#868686] pr-1">
              Didn't receive a code?
            </span>
            <button className="outline-none text-[13px] border-none text-[#199BD1] font-bold">
              Resend now
            </button>
          </div>
        </div>

        <AuthSubmitBtn text={"Verify"} />
      </form>

      {/* Right Side: Illustration */}
      <div className="hidden lg:flex w-1/2 h-full justify-center items-center">
        <img src={Forgot} alt="Forgot Password Illustration" className="w-[400px] h-[400px]" />
      </div>
    </div>
  );
};

export default VerifyOTP;
