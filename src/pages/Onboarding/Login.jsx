import React, { useContext, useState } from "react";
import { LoginImage, Logo } from "../../assets/export";
import AuthInput from "../../components/onboarding/AuthInput";
import AuthSubmitBtn from "../../components/onboarding/AuthSubmitBtn";
import { GlobalContext } from "../../contexts/GlobalContext";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "../../axios";

const Login = () => {
  const { navigate } = useContext(GlobalContext);
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/adminSignIn", {
        email,
        password,
      });
      console.log(response)
      if(response?.status === 200){
        login(response?.data);
        localStorage.setItem("token",response?.data?.token)
      navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-start items-start px-8 py-12 lg:px-24 mt-12 lg:mt-20">
        <img src={Logo} alt="FareShare Logo" className="self-start w-[150px] mb-8" />
        
        <h1 className="text-[32px] lg:text-[48px] font-bold text-black mb-2">Log In</h1>
        <p className="text-gray-500 mb-8">Enter details below to log in</p>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="w-[448px] h-[48px] flex flex-col gap-3">
          <AuthInput
            text="Email Address"
            placeholder=""
            type="email"
            state={email} // Pass email state
            setState={setEmail} // Pass setEmail function
          />
          <AuthInput
            text="Password"
            placeholder=""
            type="password"
            className="w-full"
            state={password} // Pass password state
            setState={setPassword} // Pass setPassword function
          />

          <div className="w-full flex justify-center ml-8 mb-4">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <AuthSubmitBtn text="Log In" className="bg-red-600 text-white w-full py-1" />
        </form>
      </div>

      <div className="hidden lg:flex w-1/2 justify-center items-center bg-white">
        <img src={LoginImage} alt="Login Illustration" className="w-[400px] h-[400px]" />
      </div>
    </div>
  );
};

export default Login;
