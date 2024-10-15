import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const AuthInput = ({ state, setState, text, type, error, placeholder }) => {
  const [isPassVisible, setIsPassVisible] = useState(false);

  return (
    <div className="w-full h-auto flex flex-col gap-1 justify-start items-start">
      <label className="ml-1 text-sm font-medium text-black capitalize">
        {text}
      </label>
      <div
        className={`w-full h-[52px] focus-within:border-[1px] focus-within:border-black rounded-full bg-white border border-gray-500 flex items-center justify-start ${error && "error"}`}
      >
        <div className="w-full h-full flex items-center justify-center rounded-full relative">
          <input
            type={isPassVisible ? "text" : type}
            placeholder={placeholder}
            className="w-full outline-none rounded-full placeholder:text-[13px] placeholder:font-normal placeholder:text-black text-black bg-transparent h-full px-3 text-sm font-medium" // Change text color for input
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setIsPassVisible((prev) => !prev)}
            className="absolute top-4 text-lg right-2"
            style={{ color: "#6B7373" }}
          >
            {type === "password" && (!isPassVisible ? <BsEyeSlash /> : <BsEye />)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthInput;
