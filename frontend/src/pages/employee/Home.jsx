import React from "react";
import useEmployee from "../../hooks/useEmployee";
import { useState, useEffect } from "react";
import axios from "axios";
import TitleText from "../../components/UI/TitleText";
import { useNavigate } from "react-router-dom";
import { convertTo12HourTime } from "../../helpers/convert-times";
import { Grid } from "@mui/material";

const EmployeeHome = () => {
  const [employee, setEmployee] = useEmployee();
  const Navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const isManager =
    localStorage.getItem("type") === "employeeManager" ? true : false;
  console.log(employee);
  useEffect(() => {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/booking/employee`, {
        params: {
          employeeId: employee.id,
          date: today,
        },
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          setBookings(res.data.bookings);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [employee]);

  return (
    <div className="mt-12">
      <TitleText>Hi, {employee.firstname}!</TitleText>

      <div className="mr-auto">
        <div>
          <div className="flex flex-row w-full mt-10 px-32 py-20 mr-10 justify-between ml-auto">
            <div className="w-full md:w-2/3 mx-2">
              <>
                {bookings.length > 0 ? (
                  <>
                    <div className="mb-8">
                      <TitleText>Today's Appoitnments</TitleText>
                    </div>
                    <Grid
                      container
                      spacing={2}
                      className="pb-3 pt-1 mb-12  items-center rounded-3xl border bg-secondary text-grey content-center"
                    >
                      <Grid item xs={2}>
                        <div>Customer Name</div>
                      </Grid>
                      <Grid item xs={2}>
                        <div>Service Name</div>
                      </Grid>
                      <Grid item xs={2}>
                        <div>Date</div>
                      </Grid>

                      <Grid item xs={2}>
                        <div>Customer Number</div>
                      </Grid>
                      <Grid item xs={2}>
                        Start Time
                      </Grid>
                      <Grid item xs={2}>
                        End Time
                      </Grid>
                    </Grid>
                    {bookings.map((booking, index) => (
                      <>
                        <Grid
                          key={index}
                          container
                          spacing={2}
                          className="mt-8 pb-3 pt-1 mb-6  items-center rounded-3xl  bg-secondary text-grey content-center"
                        >
                          <Grid item xs={2}>
                            <div>
                              {booking.customerFirstname}{" "}
                              {booking.customerLastname}
                            </div>
                          </Grid>
                          <Grid item xs={2}>
                            <div>{booking.serviceName}</div>
                          </Grid>
                          <Grid item xs={2}>
                            <div>{booking.date.slice(0, 10)}</div>
                          </Grid>

                          <Grid item xs={2}>
                            <div>{booking.number}</div>
                          </Grid>
                          <Grid item xs={2}>
                            {convertTo12HourTime(booking.startTime)}
                          </Grid>
                          <Grid item xs={2}>
                            {convertTo12HourTime(booking.endTime)}
                          </Grid>
                        </Grid>
                      </>
                    ))}
                  </>
                ) : (
                  <div className="text-center">No Appointments For Today!</div>
                )}
              </>
              <div className="flex justify-center items-center">
                <button
                  id="myButton"
                  className="shadow-md border-skyblue bg-skyblue text-black py-2 px-4 hover:bg-skyblue mt-6"
                  onClick={() => {
                    if (isManager) {
                      Navigate("/employee/calendar");
                    } else {
                      Navigate("/calendar");
                    }
                  }}
                >
                  View Full Calendar
                </button>
              </div>
            </div>
            <div className="mr-6 border-skyblue border w-full  bg-[#282c34]  max-w-[350px]  rounded-lg">
              <p className="my-6 mx-2 text-lg">
                Name:{" "}
                <strong>
                  {employee.firstname} {employee.lastname}
                </strong>
              </p>
              <p className="my-6 mx-2 text-lg">
                Email Address: <strong>{employee.email}</strong>
              </p>
              <p className="my-6 mx-2 text-lg">
                Phone Number: <strong>{employee.number}</strong>
              </p>
              <p className="my-6 mx-2 text-lg">
                Branch ID: <strong>{employee.branchId}</strong>
              </p>
              <p className="my-6 mx-2 text-lg">
                Role:{" "}
                <strong>{employee.role === 1 ? "Manager" : "Employee"}</strong>
              </p>
              <p className="my-6 mx-2 text-lg">
                Status:{" "}
                <strong>{employee.current ? "Active" : "Not Active"}</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default EmployeeHome;
