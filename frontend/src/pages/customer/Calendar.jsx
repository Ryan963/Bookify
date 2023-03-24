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

function Event({ event }) {
  return <div className="w-50 h-32">{event.title}</div>;
}

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
  ];
  console.log(events);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/customer/appointments/`, {
        params: {
          email: localStorage.getItem("email"),
          //write the line that ryan gave you the true or false one
        },
      })
      .then((response) => {
        const initalData = response.data.bookings;
        console.log(initalData);
        setBookingData(initalData);
      });
  }, []);

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
        min={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8)}
        max={new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)}
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
    </div>
  );
}

export default AppointmentCalendar;
