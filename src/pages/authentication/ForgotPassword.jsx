import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../assets/export";
import { useFormik } from "formik";
import { verifyEmailValues } from "../../data/authentication";
import { verifyEmailSchema } from "../../schema/verifyEmailSchema";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import Cookies from "js-cookie";
import axios from "../../axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: verifyEmailValues,
      validationSchema: verifyEmailSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        setLoading(true);
        try {
          const response = await axios.post(`/auth/sendPassOTP`, {
            email: values?.email,
            isAdmin: true,
          });
          if (response?.status === 201) {
            Cookies.set("email", values?.email);
            SuccessToast("Email Sent Successfully.");
            navigate("/auth/verify-otp");
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

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      localStorage.setItem("title", "Home");
      navigate("/home");
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

            <h3 class="text-gray-800 text-4xl font-extrabold">
              Forgot Password ?
            </h3>
            <p class="text-gray-800 text-sm mt-6 leading-relaxed">
              Welcome back! Please log in to access your account and explore a
              world of possibilities. Your journey begins here.
            </p>
          </div>
          <div>
            <div class="relative flex items-center">
              <label class="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter email"
                class="px-4 py-3.5 bg-white w-full text-sm border-2 border-gray-200 focus:border-[#c00000] rounded-lg outline-none"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#bbb"
                stroke="#bbb"
                class="w-[18px] h-[18px] absolute right-4"
                viewBox="0 0 682.667 682.667"
              >
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                  </clipPath>
                </defs>
                <g
                  clip-path="url(#a)"
                  transform="matrix(1.33 0 0 -1.33 0 682.667)"
                >
                  <path
                    fill="none"
                    stroke-miterlimit="10"
                    stroke-width="40"
                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                    data-original="#000000"
                  ></path>
                </g>
              </svg>
            </div>
            {errors.email && touched.email ? (
              <p className="text-red-700 ml-1 mt-1 text-sm font-medium">
                {errors.email}
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
          <div className="w-full bg-white rounded-2xl p-4">
            <h4 class="text-[#c00000] text-lg font-semibold">Get an OTP</h4>
            <p class="text-[13px] text-[#c00000] mt-2">
              Once you fill out this form you'll get an OTP on your provided
              email if it is registered on the platform.
            </p>
          </div>
          <div className="px-4 ">
            <h4 class="text-white text-lg font-semibold">Verify OTP</h4>
            <p class="text-[13px] text-white mt-2">
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

export default ForgotPassword;
