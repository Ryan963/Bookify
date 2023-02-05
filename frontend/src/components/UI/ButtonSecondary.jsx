import React from "react";

const ButtonSecondary = ({ children, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-orange-500 font-bold hover:bg-orange-600 text-white py-2 px-4 rounded w-full mt-6"
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
