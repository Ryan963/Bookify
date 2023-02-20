import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";




const DayBlock = ({ name, start, end }) => {
  return (
    <>
      <div className=" font-medium mb-6 text-lg w-52">
        {name}:{" "}
        <span className=" flex justify-center mr-14 ">
          {" "}
          {start} - {end}
        </span>
      </div>
    </>
  );
};


const InfoBlock = ({ name, value }) => {
  return (
    <div className="mb-6 text-lg w-2/4">
      <p className=" font-medium">{name}:</p>
      <p className="">{value}</p>
    </div>
  );
};

const ViewCompanyModal = ({ open, onClose, company }) => {


  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 780,
    height: "75%",
    backgroundColor: "#1c1c1c",
    border: "2px solid #4997c7",
    boxShadow: 30,
    borderRadius: "50px",
    overflow: "auto",
    p: 4,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    display: "block",

    
   
  };

  return (

    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          className="text-center background-color-white"
        >
           {/* Company Info */}
        </Typography>
        <hr />
       <ReviewInformation {...company}/>
     
      </Box>
    </Modal>
    
  );
};

export const ReviewInformation = ({
  name,
  email,
  number,
  description,
  mondayStart,
  mondayEnd,
  tuesdayStart,
  tuesdayEnd,
  wednesdayStart,
  wednesdayEnd,
  thursdayStart,
  thursdayEnd,
  fridayStart,
  fridayEnd,
  saturdayStart,
  saturdayEnd,
  sundayStart,
  sundayEnd,
 
}) => {
  return (
    <div >
        <>
          <h2 className="text-xl font-medium mb-5 text-center underline mt-5" >
            Review Information
          </h2>
          <div className="flex justify-between mt-8 " >
            <div>
              <InfoBlock name="Name" value={name} />
              <InfoBlock name="Email" value={email} />
              <InfoBlock name="Number" value={number} />
              <div className="mb-2 text-md w-2/3">
                <p className=" font-medium">Description:</p>
                <p className="">{description}</p>
              </div>
            </div>
            <div className="flex flex-col items-start ml-auto">
              <DayBlock name="Monday" start={mondayStart} end={mondayEnd} />
              <DayBlock name="Tuesday" start={tuesdayStart} end={tuesdayEnd} />
              <DayBlock
                name="Wednesday"
                start={wednesdayStart} end={wednesdayEnd}
              />
              <DayBlock
                name="Thursday"
                start={thursdayStart}
                end={thursdayEnd}
              />
              <DayBlock name="Friday" start={fridayStart} end={fridayEnd} />
              <DayBlock
                name="Saturday"
                start={saturdayStart}
                end={saturdayEnd}
              />
              <DayBlock name="Sunday" start={sundayStart} end={sundayEnd} />
            </div>
          </div>
          
        </>
        
    </div>
  );
};

export default ViewCompanyModal;