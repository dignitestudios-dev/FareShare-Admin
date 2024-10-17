import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const AuthInput = ({ state, setState, text, type, error, placeholder }) => {
  const [isPassVisible, setIsPassVisible] = useState(false);

  return (
    <div className="w-full lg:w-[448px] h-auto flex flex-col gap-1 justify-start items-start">
      <label className="ml-1 text-[12px] font-bold leading-[19.78px] text-[#0A150F] capitalize">
        {text}
      </label>
      <div
        className={`w-full h-[48px]  focus-within:border-black rounded-[20px] bg-white border-[0.8px] border-[#000]/[0.19] flex items-center justify-start ${
          error && "error"
        }`}
      >
        <div className="w-full h-full flex items-center justify-center rounded-full relative">
          <input
            type={isPassVisible ? "text" : type}
            placeholder={placeholder}
            className="w-full outline-none rounded-full placeholder:text-[13px] placeholder:font-normal placeholder:text-black text-black bg-transparent h-full px-3 text-md font-medium" // Change text color for input
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setIsPassVisible((prev) => !prev)}
            className="absolute top-[14px] text-md right-3"
            style={{ color: "#6B7373" }}
          >
            {type === "password" &&
              (!isPassVisible ? <BsEyeSlash /> : <BsEye />)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthInput;
