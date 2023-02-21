import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

/**
 *
 * @param {*} companyId
 * @param {*} dependencies this will be passed to the useEffect to know when it needs to run
 * if you don't have any dependencies pass [] as dependencies
 * @returns
 */
function useCompanyServices(companyId, dependencies) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/companyService`,
          {
            params: { companyId: companyId },
          }
        );
        if (res.data.success) {
          setServices(res.data.services);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    })();
  }, dependencies);

  return [services, setServices];
}
export default useCompanyServices;
