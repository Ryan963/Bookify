import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import axios from "axios";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  calendar: {
    height: "80vh",
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
}));

const AppointmentTooltip = ({ appointment }) => {
  return (
    <div>
      <div>{appointment.title}</div>
      <div>Service: {appointment.service}</div>
      <div>Employee: {appointment.employee}</div>
    </div>
  );
};

function AppointmentCalendar() {
  const classes = useStyles();
  const [bookingData, setBookingData] = useState([]);
  const events = [
    {
      id: 1,
      title: "Haircut With John Doe",
      start: new Date(2023, 1, 21, 10, 0, 0),
      end: new Date(2023, 1, 21, 11, 30, 0),
      employee: "John Doe",
    },
    {
      id: 2,
      title: "Massage",
      start: new Date(2023, 2, 16, 14, 0, 0),
      end: new Date(2023, 2, 16, 15, 0, 0),
      employee: "Jane Smith",
    },
    {
      id: 3,
      title: "Manicure",
      start: new Date(2023, 2, 17, 16, 0, 0),
      end: new Date(2023, 2, 17, 17, 0, 0),
      employee: "John Doe",
    },
  ];

  useEffect(() => {
    // here you will need to write the get request to get your data
    // you will need to set the bookingData state to the data after you manipulate it
    // to match the data above
    // to set the booking data do this setBookingData(Your Final Data Goes here)
    console.log("hello");
    axios.get(`${process.env.REACT_APP_SERVER_URL}/calendar/`).then((response) => {
      const initalData = response.data.data;
      console.log(initalData);
    });
  }, []);

  return (
    <div>
      <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" views={["month", "week"]} step={30} defaultView="month" className={classes.calendar} popup={true} selectable />
    </div>
  );
}

export default AppointmentCalendar;
