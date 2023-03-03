import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateEmployeeRoute = () => {
  const userEmail = localStorage.getItem("email");
  const userType = localStorage.getItem("type");

  return !userEmail ||
    userEmail.length === 0 ||
    !userType ||
    (userType.toLowerCase() !== "employee" &&
      userType.toLowerCase() !== "employeemanager") ? (
    <Navigate to="/employee/login" />
  ) : (
    <Outlet />
  );
};

export default PrivateEmployeeRoute;
