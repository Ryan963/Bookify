import React from "react";

const TitleText = ({ children }) => {
  return (
    <div className="text-3xl font-bold justify-center flex my-3">
      {children}
    </div>
  );
};

export default TitleText;
