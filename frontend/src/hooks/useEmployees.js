import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const useEmployees = (companyId, dependencies) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    (async () => {
      if (companyId) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/employee/`,
            {
              params: {
                companyId: companyId,
              },
            }
          );
          if (res.data.success) {
            setEmployees(res.data.employees);
          } else {
            toast.error(res.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error("Could not retrieve the employees");
        }
      }
    })();
  }, dependencies);
  return [employees, setEmployees];
};

export default useEmployees;
