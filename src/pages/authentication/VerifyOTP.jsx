import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../assets/export";
import Cookies from "js-cookie";
import { verifyOtpValues } from "../../data/authentication";
import { verifytOtpSchema } from "../../schema/verifyOtpSchema";
import { useFormik } from "formik";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: verifyOtpValues,
      validationSchema: verifytOtpSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        setLoading(true);
        try {
          const response = await axios.post(`/auth/validatePassOTP`, {
            code: values?.otp.toString(),
            email: Cookies.get("email"),
          });
          if (response?.status === 200) {
            SuccessToast("OTP Verified Successfully.");
            Cookies.set("resetToken", response?.data?.resetToken);
            navigate("/auth/change-password");
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          ErrorToast(error?.response?.data?.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      },
    });

  const [resend, setResend] = useState(false);
  const resentOTP = async (e) => {
    e.preventDefault();
    try {
      setResend(true);
      const response = await axios.post("/auth/sendPassOTP", {
        email: Cookies.get("email"),
        isAdmin: true,
      });
      if (response?.status === 201) {
        setResend(false);
        SuccessToast("Email Resent Sent Successfully.");
      }
    } catch (error) {
      setResend(false);
      ErrorToast(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    if (token) {
      localStorage.setItem("title", "Home");
      navigate("/home");
    } else if (!email) {
      navigate("/auth/login");
    } else {
      return;
    }
  }, []);
  return (
    <div class="w-full  bg-white">
      <div class="grid lg:grid-cols-4 md:grid-cols-3 items-center">
        <form
          onSubmit={handleSubmit}
          class="lg:col-span-3 md:col-span-2 max-w-lg w-full p-6 mx-auto"
        >
          <div class="mb-12">
            <img src={Logo} alt="" className="mb-10 scale-110" />

            <h3 class="text-gray-800 text-4xl font-extrabold">Verify OTP !</h3>
            <p class="text-gray-800 text-sm mt-6 leading-relaxed">
              Welcome back! Please log in to access your account and explore a
              world of possibilities. Your journey begins here.
            </p>
          </div>

          <div>
            <div class="relative flex items-center">
              <label class="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
                OTP
              </label>
              <input
                type="number"
                id="otp"
                name="otp"
                value={values.otp}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter 4 digit OTP Code"
                class="px-4 py-3.5 bg-white w-full text-sm border-2 border-gray-200 focus:border-[#c00000] rounded-lg outline-none"
              />
              <button
                type="button"
                disabled={resend}
                onClick={resentOTP}
                className="absolute right-2 w-auto py-2 rounded-md px-2 bg-[#c00000] text-white text-sm font-medium flex items-center justify-center"
              >
                {resend ? (
                  <div
                    class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Resend"
                )}
              </button>
            </div>
            {errors.otp && touched.otp ? (
              <p className="text-red-700 ml-1 mt-1 text-sm font-medium">
                {errors.otp}
              </p>
            ) : null}
          </div>

          <div class="mt-12">
            <button
              type="submit"
              class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wider font-semibold rounded-full text-white button-bg  focus:outline-none"
            >
              Continue
              <span className="ml-2">
                {loading && (
                  <div
                    class="animate-spin inline-block size-3 border-[3px] border-current border-t-transparent text-white rounded-full"
                    role="status"
                    aria-label="loading"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                )}
              </span>
            </button>
          </div>
        </form>

        <div class="flex flex-col justify-center space-y-16 md:h-screen max-md:mt-16 min-h-full bg lg:px-8  ">
          <div className="w-full ">
            <h4 class="text-white text-lg font-semibold">Get an OTP</h4>
            <p class="text-[13px] text-white mt-2">
              Once you fill out this form you'll get an OTP on your provided
              email if it is registered on the platform.
            </p>
          </div>
          <div className="px-4 bg-white rounded-2xl p-4">
            <h4 class="text-[#c00000] text-lg font-semibold">Verify OTP</h4>
            <p class="text-[13px] text-[#c00000] mt-2">
              Once you got the 'OTP', you need to provide us the OTP to let us
              know that it's you trying to recover the password.
            </p>
          </div>
          <div className="px-4">
            <h4 class="text-white text-lg font-semibold">Change Password</h4>
            <p class="text-[13px] text-white mt-2">
              Easily recover your account after successfull verification by
              providing us the new password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
