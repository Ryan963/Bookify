import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const useBranches = (employee) => {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/branch/`,
          {
            params: {
              companyId: employee.companyId,
            },
          }
        );
        if (res.data.success) {
          setBranches(res.data.branches);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Could not retrieve the Branches");
      }
    })();
  }, [employee]);
  return [branches, setBranches];
};

export default useBranches;
