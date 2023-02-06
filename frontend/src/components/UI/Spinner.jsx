import React from "react";
import { CircularProgress } from "@mui/material";
const Loader = () => {
  return (
    <CircularProgress>
      <span className="visually-hidden" color="white">
        Loading...
      </span>
    </CircularProgress>
  );
};

export default Loader;
