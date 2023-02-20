import React, { useEffect } from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { useState } from "react";
import InputField from "../../components/UI/InputField";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TitleText from "../../components/UI/TitleText";
import ButtonSecondary from "../../components/UI/ButtonSecondary";
import { FaCheckCircle } from "react-icons/fa";
import Loader from "../../components/UI/Spinner";
const styles = {
  root: {
    background: "transparent",
    color: "white",
    "& .MuiStepIcon-root": {
      color: "orange",
    },
    "& .MuiStepLabel-label": {
      color: "white",
    },
  },
};

const PageStepper = withStyles(styles)(({ classes, ...props }) => {
  return (
    <Stepper classes={{ root: classes.root }} activeStep={props.activeStep}>
      <Step>
        <StepLabel>Company Info</StepLabel>
      </Step>
      <Step>
        <StepLabel>Availability Info</StepLabel>
      </Step>
      <Step>
        <StepLabel>Review & Register</StepLabel>
      </Step>
    </Stepper>
  );
});

const DayBlock = ({ name, start, end }) => {
  return (
    <>
      <p className=" font-medium mb-6 text-lg w-52">
        {name}:{" "}
        <span className="">
          {" "}
          {start} - {end}
        </span>
      </p>
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
export const ReviewInformation = ({
  name,
  email,
  number,
  description,
  homePic,
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
  onClick,
  disabled,
  success,
}) => {
  return (
    <div
      style={{ width: "700px" }}
      className="rounded-lg shadow-lg p-6 pb-8 bg-secondary text-white mt-2"
    >
      {success ? (
        <div className="flex flex-col items-center">
          <p className="text-lg mt-4 mb-8">
            Your Company has been registered successfully!
          </p>
          <FaCheckCircle color="orange" size={200} />
          <p className="text-md mt-8 mb-4 overflow-hidden">
            Please wait for the approval Email, you will get the information
            needed for you to login and start adding more employees, branches,
            and services to your company.
          </p>
          <p className="text-lg mt-2 mb-2">
            Thank you again for registering your company at Bookify!
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-medium mb-5 text-center underline">
            Review Information
          </h2>
          <div className="flex justify-betweem ">
            <div>
              <InfoBlock name="Name" value={name} />
              <InfoBlock name="Email" value={email} />
              <InfoBlock name="Number" value={number} />
              <div className="mb-2 text-md w-2/3">
                <p className=" font-medium">Description:</p>
                <p className="">{description}</p>
              </div>
            </div>
            <div className="flex-col ml-auto">
              <DayBlock name="Monday" start={mondayStart} end={mondayEnd} />
              <DayBlock name="Tuesday" start={tuesdayStart} end={tuesdayEnd} />
              <DayBlock
                name="Wednesday"
                start={wednesdayStart}
                end={wednesdayEnd}
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
          <ButtonSecondary onClick={onClick} disabled={disabled}>
            {disabled ? <Loader /> : "Register"}
          </ButtonSecondary>
        </>
      )}
    </div>
  );
};

const CompanyRegister = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [company, setCompany] = useState({
    name: "",
    email: "",
    number: "",
    description: "",
    homePic: "",
    mondayStart: "",
    mondayEnd: "",
    tuesdayStart: "",
    tuesdayEnd: "",
    wednesdayStart: "",
    wednesdayEnd: "",
    thursdayStart: "",
    thursdayEnd: "",
    fridayStart: "",
    fridayEnd: "",
    saturdayStart: "",
    saturdayEnd: "",
    sundayStart: "",
    sundayEnd: "",
  });
  const dayArray = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const hours = [
    "9am",
    "10am",
    "11am",
    "12pm",
    "1pm",
    "2pm",
    "3pm",
    "4pm",
    "5pm",
    "6pm",
    "7pm",
    "8pm",
    "9pm",
    "10pm",
    "11pm",
  ];
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const initializeDates = () => {
    const companyCopy = { ...company };
    for (let day of dayArray) {
      companyCopy[`${day}Start`] = hours[0];
      companyCopy[`${day}End`] = hours[hours.length - 1];
    }
    setCompany(companyCopy);
  };

  useEffect(() => {
    initializeDates();
    localStorage.clear();
  }, []);
  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    setCompany({ ...company, homePic: e.target.files[0] });
  };

  const checkFirstStep = () => {
    if (company?.name.length === 0) {
      toast.error("name is required");
      return;
    }
    if (company?.email.length === 0) {
      toast.error("email is required");
      return;
    }
    if (company?.number.length === 0) {
      toast.error("number is required");
      return;
    }
    if (company?.description.length === 0) {
      toast.error("Description is required");
      return;
    }
    setActiveStep(activeStep + 1);
  };

  // checks if company info are set correctly and moves to next step
  const checkSecondStep = () => {
    for (let day of dayArray) {
      const start = Number.parseInt(
        company[`${day}Start`].slice(0, company[`${day}Start`].length - 2)
      );
      const startTime = company[`${day}Start`].slice(
        company[`${day}Start`].length - 2,
        company[`${day}Start`].length
      );
      const end = Number.parseInt(
        company[`${day}End`].slice(0, company[`${day}End`].length - 2)
      );
      const endTime = company[`${day}End`].slice(
        company[`${day}End`].length - 2,
        company[`${day}End`].length
      );
      if (
        (start > end && startTime === endTime) ||
        (startTime === "pm" && endTime === "am")
      ) {
        toast.error(
          `${day.toUpperCase()} opening time cannot be past the closing time!`
        );
        return;
      }
    }
    setActiveStep(activeStep + 1);
  };

  // create new company
  const handleSubmit = async () => {
    setButtonDisabled(true);
    const formData = new FormData();
    for (let key in company) {
      formData.append(key, company[key]);
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/company/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        setSuccessState(true);
      }
      setButtonDisabled(false);
    } catch (error) {
      console.log(error);
      setButtonDisabled(false);
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <div className="flex-0 mt-20   pb-5 px-6  justify-center items-center rounded-lg  w-3/5">
          <TitleText>Register Your Company</TitleText>
          <PageStepper activeStep={activeStep} />
          <div className="px-6 flex  justify-between items-center">
            {activeStep > 0 && (
              <Button
                variant="contained"
                style={{
                  background: "grey",
                }}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                <div className="mx-3 ">Prev</div>
              </Button>
            )}
            {activeStep < 2 && (
              <div className="ml-auto">
                <Button
                  variant="contained"
                  onClick={activeStep === 0 ? checkFirstStep : checkSecondStep}
                >
                  <div className="mx-3 ">Next</div>
                </Button>
              </div>
            )}
          </div>
          <div className=" flex justify-center">
            <div className="ml-5 w-3/2">
              {activeStep === 0 && (
                <>
                  <InputField
                    onChange={handleChange}
                    name="name"
                    value={company.name}
                    placeholder="Enter Name"
                    type="text"
                  />
                  <InputField
                    onChange={handleChange}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={company.email}
                  />
                  <InputField
                    onChange={handleChange}
                    name="number"
                    placeholder="Enter number"
                    value={company.number}
                    type="string"
                  />

                  <textarea
                    className="my-6 w-full h-36 rounded-md border-skyblue border-2 text-black"
                    onChange={handleChange}
                    name="description"
                    placeholder="Enter description"
                    value={company.description}
                    type="string"
                  />
                  <label htmlFor="file">Upload Home Picture: </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    name="homePic"
                  />
                </>
              )}
              {activeStep === 1 && (
                <div className="flex justify-center">
                  <div
                    style={{
                      marginLeft: "10%",
                    }}
                  >
                    <h3 className="font-bold w-32 text-center">Days</h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: `4.2rem`,
                        marginRight: "7rem",
                      }}
                    >
                      {dayArray.map((day) => (
                        <div key={day} className="mb-4 pb-2">
                          <button
                            className="text-white rounded-md px-3 py-2 mb-1 font-bold w-32 border text-white bg-transparent border-skyblue border-2"
                            id={day}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "30%",
                    }}
                  >
                    <h2 className="font-bold text-center">Hours</h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: `2rem`,
                      }}
                    >
                      <div className="flex justify-between w-80 mb-2 pb-2">
                        <h3>Opening</h3>
                        <h3>Closing</h3>
                      </div>
                      {dayArray.map((day) => (
                        <>
                          <div className="flex justify-between w-80 mb-6 pb-2">
                            <select
                              className="text-black rounded-md px-3 h-10 font-bold"
                              name={`${day}Start`}
                              onChange={handleChange}
                            >
                              {hours.map((hour) => (
                                <option
                                  id={`${hour}`}
                                  key={`${hour}`}
                                  style={{
                                    width: "80px",
                                    margin: "20px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(0, 0, 0, 0.082)",
                                  }}
                                  selected={company[`${day}Start`] === hour}
                                >
                                  {hour}
                                </option>
                              ))}
                            </select>
                            <select
                              name={`${day}End`}
                              className="text-black rounded-md px-3 h-10 font-bold"
                              onChange={handleChange}
                            >
                              {hours.map((hour) => (
                                <option
                                  id={`${hour}`}
                                  key={`${hour}`}
                                  style={{
                                    width: "80px",
                                    margin: "20px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(0, 0, 0, 0.082)",
                                  }}
                                  selected={company[`${day}End`] === hour}
                                >
                                  {hour}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeStep === 2 && (
                <>
                  <ReviewInformation
                    {...company}
                    onClick={handleSubmit}
                    disabled={buttonDisabled}
                    success={successState}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyRegister;


