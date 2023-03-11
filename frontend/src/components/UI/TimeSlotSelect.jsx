import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  timeSlotsContainer: {
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  timeSlot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: theme.spacing(10),
    minWidth: theme.spacing(10),
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      transform: "scale(1.1)",
      boxShadow: theme.shadows[4],
    },
  },
  timeSlotSelected: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    boxShadow: theme.shadows[4],
    zIndex: 1,
    transform: "scale(1.1)",
  },
}));

function TimeSlotSelect(props) {
  const classes = useStyles();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  function formatTimeSlot(timeSlot) {
    const [hour, minute] = timeSlot.split(":");
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  }

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <>
      <Typography variant="h6">Select a Time</Typography>
      <div className={classes.timeSlotsContainer}>
        {props.availableTimeSlots.map((timeSlot) => (
          <div
            className={clsx(classes.timeSlot, {
              [classes.timeSlotSelected]: selectedTimeSlot === timeSlot,
            })}
            key={timeSlot}
            onClick={() => handleTimeSlotSelect(timeSlot)}
          >
            {formatTimeSlot(timeSlot)}
          </div>
        ))}
      </div>
    </>
  );
}

export default TimeSlotSelect;
