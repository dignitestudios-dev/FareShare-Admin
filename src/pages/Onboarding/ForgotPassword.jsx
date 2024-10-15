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
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-start px-8 py-12 lg:px-24 mt-12 lg:mt-20">
        {/* Logo */}
        <img src={Logo} alt="FareShare Logo" className="self-start w-[150px] mb-6 lg:mb-8" /> 
        
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black self-start mb-4"
        >
          <BiArrowBack className="text-2xl" />
        </button>

        <h1 className="text-[32px] lg:text-[48px] font-bold text-black mb-2">Forgot Password</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Enter your registered email address to recover your password.
        </p>

        <form
          onSubmit={() => navigate("/verify-otp")}
          className="w-full flex flex-col gap-4"
        >
          <AuthInput
            text="Email Address"
            placeholder="mike.smith@gmail.com"
            type="email"
            className="w-full"
          />
          <AuthSubmitBtn text="Next" className="bg-red-600 text-white w-full py-3" />
        </form>
      </div>

      {/* Right side: Illustration */}
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <img src={Forgot} alt="Forgot Password Illustration" className="w-[400px] h-[400px]" />
      </div>
    </div>
  );
};

export default ForgotPassword;
