import React, { useContext, useState } from "react";
import AuthSubmitBtn from "../../components/onboarding/AuthSubmitBtn";
import { GlobalContext } from "../../contexts/GlobalContext";
import { BiArrowBack } from "react-icons/bi";
import AuthInput from "../../components/onboarding/AuthInput";
import { Forgot, Logo } from "../../assets/export"; // Add FareShare logo here
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toast";

const VerifyOTP = () => {
  const { navigate } = useContext(GlobalContext);

  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      // Ensure only digits or empty value
      const newCode = [...code];
      newCode[index] = value; // Update only the current input
      setCode(newCode);

      // Move focus to next input field if current is filled
      if (value && index < 4) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    } else {
      setError("Only numbers are allowed.");
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index] === "") {
        // Move to previous input if current is empty
        if (index > 0) {
          document.getElementById(`code-${index - 1}`).focus();
        }
      } else {
        // Clear current input if it's not empty
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
      e.preventDefault();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").split("");
    const newCode = [...code];

    pasteData.forEach((char, i) => {
      if (i + index < 4 && /^\d$/.test(char)) {
        newCode[i + index] = char; // Insert only one number at a time
      }
    });

    setCode(newCode);
    document
      .getElementById(`code-${Math.min(index + pasteData.length, 3)}`)
      .focus();
  };

  const verify = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      if (code == "") {
        ErrorToast("OTP Code cannot be left empty.");
      } else if (code.length < 4) {
        ErrorToast("Please enter the OTP code correctly.");
      } else if (!localStorage.getItem("email")) {
        ErrorToast(
          "We can't find your email. Please go back to the forgot password screen."
        );
      } else {
        setLoading(true);
        const response = await axios.post("/auth/validatePassOTP", {
          email: localStorage.getItem("email"),
          code: verificationCode,
        });
        if (response?.status === 200) {
          setLoading(false);
          localStorage.setItem("resetToken", response?.data?.resetToken);
          SuccessToast("OTP Verified Successfully.");
          navigate("/reset-password", "Home");
        }
      }
    } catch (error) {
      setLoading(false);
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  };
  const [resend, setResend] = useState(false);
  const resentOTP = async (e) => {
    e.preventDefault();
    try {
      setResend(true);
      const response = await axios.post("/auth/sendPassOTP", {
        email: localStorage.getItem("email"),
        isAdmin: true,
      });
      if (response?.status === 201) {
        setResend(false);
        SuccessToast("Verification Code Resent Sent Successfully.");
      }
    } catch (error) {
      setResend(false);
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Left Side: Form */}
      <form
        onSubmit={verify}
        className="w-full lg:w-1/2 h-full bg-white px-8 py-[44px] lg:px-[111px] z-10 flex flex-col overflow-y-auto justify-start items-start gap-8"
      >
        {/* Logo */}
        <img
          src={Logo}
          alt="FareShare Logo"
          className="self-start w-[150px] mb-8"
        />

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full flex justify-start items-start flex-col"
        >
          <BiArrowBack className="text-3xl text-black" />
        </button>

        {/* Title and Description */}
        <div className="w-full flex justify-start items-start flex-col">
          <h1 className="text-[32px] lg:text-[36px] font-bold leading-[59.22px] text-black">
            Verification
          </h1>
          <p className="text-gray-500 text-[12px] lg:text-[14px] font-normal leading-[22.18px]  ">
            Enter verification code sent to your email
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="w-full  lg:w-[448px] h-auto grid grid-cols-4 justify-start items-center gap-4">
          {code?.map((digit, index) => {
            return (
              <input
                key={index}
                id={`code-${index}`}
                type="tel" // Changed from 'text' to 'tel'
                inputMode="numeric" // Added inputMode to ensure numeric input
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                maxLength="1"
                className=" h-[70px] rounded-2xl bg-transparent outline-none text-center border-[1px] border-[#c2c6cb] text-black text-2xl focus:border-[#55C9FA]"
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
            <button
              type="button"
              onClick={resentOTP}
              disabled={resend}
              className="outline-none text-[13px] border-none text-[#199BD1] font-bold"
            >
              Resend now
            </button>
          </div>
        </div>
        <div className="w-full flex justify-start items-start flex-col">
          <AuthSubmitBtn loading={loading} text={"Verify"} />
        </div>
      </form>

      {/* Right Side: Illustration */}
      <div className="hidden lg:flex w-1/2 bg-[#FBFBFB] h-full justify-center items-center">
        <img
          src={Forgot}
          alt="Forgot Password Illustration"
          className="w-[415px] "
        />
      </div>
    </div>
  );
};

export default VerifyOTP;
