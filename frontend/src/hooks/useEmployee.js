import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useEmployee = () => {
  const navigate = useNavigate("");
  const userEmail = localStorage.getItem("email");
  const type = localStorage.getItem("type");
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    if (
      userEmail &&
      type &&
      (type === "employee" || type === "employeeManager")
    ) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/employee/:${userEmail}`, {
          params: {
            employeeEmail: userEmail,
          },
          
        })

        .then((res) => {
          setEmployee(res.data.employee);
          
        })
        .catch((error) => {
          console.log(error);
          toast.error("could not retrieve employee");
        });
    } else {
      navigate("/employee/login");
    }
  }, []);

  return [employee, setEmployee];
};

export default useEmployee;
