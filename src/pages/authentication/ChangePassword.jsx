import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../assets/export";
import { ErrorToast, SuccessToast } from "../../components/app/global/Toast";
import { changePassValues } from "../../data/authentication";
import { changePassSchema } from "../../schema/changePassSchema";
import { useFormik } from "formik";
import axios from "../../axios";
import Cookies from "js-cookie";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [showConf, setShowConf] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: changePassValues,
      validationSchema: changePassSchema,
      validateOnChange: true,
      validateOnBlur: false,

      onSubmit: async (values, action) => {
        setLoading(true);
        try {
          const response = await axios.post(`/auth/updatePassOTP`, {
            email: Cookies.get("email"),
            password: values?.password,
            confirmPassword: values?.confirmPassword,
            resetToken: Cookies.get("resetToken"),
          });
          if (response?.status === 200) {
            SuccessToast("Password updated successfully.");
            navigate("/auth/login");
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
    const reset = Cookies.get("resetToken");
    if (token) {
      localStorage.setItem("title", "Home");
      navigate("/home");
    } else if (!reset) {
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

            <h3 class="text-gray-800 text-4xl font-extrabold">
              Change Password
            </h3>
            <p class="text-gray-800 text-sm mt-6 leading-relaxed">
              Welcome back! Please log in to access your account and explore a
              world of possibilities. Your journey begins here.
            </p>
          </div>

          <div>
            <div class="relative flex items-center mt-8">
              <label class="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
                Password
              </label>
              <input
                type={show ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter password"
                class="px-4 py-3.5 bg-white w-full text-sm border-2 border-gray-200 focus:border-[#c00000] rounded-lg outline-none"
              />
              <span
                className="absolute cursor-pointer right-4 text-gray-400"
                onClick={() => setShow((prev) => !prev)}
              >
                {showConf ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            {errors.password && touched.password ? (
              <p className="text-red-700 ml-1 mt-1 text-sm font-medium">
                {errors.password}
              </p>
            ) : null}
          </div>
          <div>
            <div class="relative flex items-center mt-8">
              <label class="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
                Confirm Password
              </label>
              <input
                type={showConf ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Re enter password"
                class="px-4 py-3.5 bg-white w-full text-sm border-2 border-gray-200 focus:border-[#c00000] rounded-lg outline-none"
              />
              <span
                className="absolute cursor-pointer right-4 text-gray-400"
                onClick={() => setShowConf((prev) => !prev)}
              >
                {showConf ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            {errors.confirmPassword && touched.confirmPassword ? (
              <p className="text-red-700 ml-1 mt-1 text-sm font-medium">
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <div class="mt-12">
            <button
              type="submit"
              class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wider font-semibold rounded-full text-white button-bg  focus:outline-none"
            >
              Update Password
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
          <div className="px-4 ">
            <h4 class="text-white text-lg font-semibold">Verify OTP</h4>
            <p class="text-[13px] text-white mt-2">
              Once you got the 'OTP', you need to provide us the OTP to let us
              know that it's you trying to recover the password.
            </p>
          </div>
          <div className="px-4 bg-white rounded-2xl p-4">
            <h4 class="text-[#c00000] text-lg font-semibold">
              Change Password
            </h4>
            <p class="text-[13px] text-[#c00000] mt-2">
              Easily recover your account after successfull verification by
              providing us the new password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
