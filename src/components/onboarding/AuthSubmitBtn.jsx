import React from "react";

const AuthSubmitBtn = ({ text, loading }) => {
  return (
    <div className="w-full lg:w-[448px]  h-auto flex   flex-col gap-1 justify-start items-start  ">
      <button
        type="submit"
        className="w-full h-[48px]  bg-[#C00000] text-white rounded-[20px] flex gap-2 items-center justify-center  "
      >
        <span>
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
        <span className="text-[13px] font-bold leading-[24px]">{text}</span>
      </button>
    </div>
  );
};

export default AuthSubmitBtn;
