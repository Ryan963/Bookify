import React from "react";

const ButtonPrimary = ({ children, disabled, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={"bg-skyblue rounded-md text-lg w-full py-3 font-bold"}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
