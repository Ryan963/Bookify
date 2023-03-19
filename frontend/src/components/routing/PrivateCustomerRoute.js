import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateCustomerRoute = () => {
  const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");

  return !userEmail ||
    userEmail.length === 0 ||
    !userType ||
    userType.toLowerCase() !== "user" ? (
    <Navigate to="/" />
  ) : (
    <Outlet />
  );
};

export default PrivateCustomerRoute;
