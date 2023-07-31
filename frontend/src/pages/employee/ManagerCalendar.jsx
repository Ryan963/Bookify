import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import useBranches from "../../hooks/useBranches";
import useEmployee from "../../hooks/useEmployee";
import { FormLabel } from "@material-ui/core";
const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  calendar: {
    height: "80vh",
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

const AppointmentTooltip = ({ event }) => {
  return (
    <div>
      <div>{event.title}</div>
      <div>Service: {event.service}</div>
      <div>Employee: {event.employee}</div>
    </div>
  );
};

function Event({ event }) {
  return <div className="w-50 h-32">{event.title}</div>;
}

function ManagerCalendar() {
  const classes = useStyles();
  const [bookingData, setBookingData] = useState([]);
  const [employee, setEmployee] = useEmployee();
  const [branches, setBranches] = useBranches(employee);
  const [branchId, setBranchId] = useState(null);
  const isManager =
    localStorage.getItem("type") === "employeeManager" ? true : false;
  const events = [
    {
      id: 1,
      title: "Haircut With John Doe",
      start: new Date(2023, 1, 21, 10, 0, 0),
      end: new Date(2023, 1, 21, 11, 30, 0),
      employee: "John Doe",
    },
  ];
  console.log(events);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/calendar/`, {
        params: {
          branchId: branchId,
          isManager: isManager,
        },
      })
      .then((response) => {
        const initalData = response.data.bookings;
        console.log(initalData);
        setBookingData(initalData);
      });
  }, [branchId]);

  const parseDate = (fullDate) => {
    const date = fullDate
      .slice(0, 10)
      .split("-")
      .map((date) => Number(date));
    const time = fullDate
      .slice(11, 19)
      .split(":")
      .map((time) => Number(time));
    return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
  };

  const today = new Date();

  return (
    <div>
      {isManager && (
        <>
          <FormLabel style={{ color: "white" }}>
            Select Branch to View Calendar:
          </FormLabel>
          <Select
            style={{
              backgroundColor: "white",
              width: "400px",
              margin: "10px",
            }}
            labelId="employee-select-label"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.address}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
      {branchId !== null && (
        <Calendar
          localizer={localizer}
          events={bookingData}
          startAccessor={(event) => {
            return parseDate(event.start);
          }}
          endAccessor={(event) => {
            return parseDate(event.end);
          }}
          views={["month", "week"]}
          step={30}
          defaultView="month"
          className={classes.calendar}
          popup={true}
          min={
            new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8)
          }
          max={
            new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)
          }
          components={{
            event: Event,
            timeSlotWrapper: (props) => (
              <div
                style={{
                  height: "50px",
                }}
                {...props}
              />
            ),
          }}
          selectable
        />
      )}
    </div>
  );
}

export default ManagerCalendar;
