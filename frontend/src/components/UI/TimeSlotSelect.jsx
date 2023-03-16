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
    width: "10rem",
    minWidth: "160px",
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

function TimeSlotSelect({
  availableTimeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
}) {
  const classes = useStyles();
  function formatTimeSlot(timeSlot) {
    const [hour, minute] = timeSlot.split(":");
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const hour12 = hourInt % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  }

  const handleTimeSlotSelect = (timeSlot) => {
    console.log(timeSlot);
    setSelectedTimeSlot(timeSlot);
  };

  return (
    <>
      <Typography variant="h6">Select a Time</Typography>
      <div className={classes.timeSlotsContainer}>
        {availableTimeSlots.map((timeSlot) => (
          <div
            className={clsx(classes.timeSlot, {
              [classes.timeSlotSelected]: selectedTimeSlot === timeSlot,
            })}
            key={timeSlot}
            onClick={() => handleTimeSlotSelect(timeSlot)}
          >
            {formatTimeSlot(timeSlot[0])} - {formatTimeSlot(timeSlot[1])}
          </div>
        ))}
      </div>
    </>
  );
}

export default TimeSlotSelect;
