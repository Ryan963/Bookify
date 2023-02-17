import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function useServices() {
  const [services, setServices] = useState([]);
  const getServices = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/service`
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
  };
  useEffect(() => {
    getServices();
  }, []);

  return [services, setServices];
}
export default useServices;
