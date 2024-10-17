import React, { useContext, useState } from "react";
import { LoginImage, Logo } from "../../assets/export";
import AuthInput from "../../components/onboarding/AuthInput";
import AuthSubmitBtn from "../../components/onboarding/AuthSubmitBtn";
import { GlobalContext } from "../../contexts/GlobalContext";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toast";

const Login = () => {
  const { navigate } = useContext(GlobalContext);
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (email == "") {
        ErrorToast("Email cannot be left empty.");
      } else if (password == "") {
        ErrorToast("Password cannot be left empty.");
      } else if (password.length < 6) {
        ErrorToast("Password must contain 6 characters.");
      } else {
        setLoading(true);

        const response = await axios.post("/auth/adminSignIn", {
          email,
          password,
        });
        console.log(response);
        if (response?.status === 200) {
          setLoading(false);

          login(response?.data);
          localStorage.setItem("token", response?.data?.token);
          SuccessToast("Logged In Successfully.");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      setLoading(false);
      ErrorToast(error?.response?.data?.message || "Something went wrong");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-start items-start px-8 py-[44px] lg:px-[111px] ">
        <img
          src={Logo}
          alt="FareShare Logo"
          className="self-start  w-[155px] mb-8"
        />
        <div className="flex flex-col justify-start items-start w-full h-full mt-14">
          <h1 className="text-[32px] lg:text-[36px] font-bold leading-[59.22px] text-black ">
            Log In
          </h1>
          <p className="text-gray-500 text-[12px] lg:text-[14px] font-normal leading-[22.18px]  mb-8">
            Enter below details to log in
          </p>

          <form
            onSubmit={handleLogin}
            className="w-[448px]  flex flex-col gap-3"
          >
            <AuthInput
              text="Email Address"
              placeholder=""
              type="email"
              state={email}
              setState={setEmail}
            />
            <AuthInput
              text="Password"
              placeholder=""
              type="password"
              className="w-full"
              state={password} // Pass password state
              setState={setPassword} // Pass setPassword function
            />

            <div className="w-full flex justify-center ">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-normal ml-auto -mt-1 capitalize leading-[19.01px] text-[#00A1FC] hover:underline"
              >
                forgot password?
              </button>
            </div>

            <AuthSubmitBtn
              text="Log In"
              loading={loading}
              className="bg-red-600 text-white w-full py-1"
            />
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 justify-center items-center bg-[#FBFBFB]">
        <img src={LoginImage} alt="Login Illustration" className="w-[443px] " />
      </div>
    </div>
  );
};

export default Login;
