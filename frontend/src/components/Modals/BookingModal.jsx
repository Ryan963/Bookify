import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { format } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import TimeSlotSelect from "../UI/TimeSlotSelect";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      marginBottom: theme.spacing(2),
    },
  },
  timeSlotsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    width: "100%",
  },
}));

const BookingModal = ({
  company,
  branch,
  service,
  isOpen,
  onClose,
  onSave,
}) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState("anyone");
  const employees = branch.employees;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleEmployeeSelect = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleSave = () => {
    onSave(selectedDate, selectedTimeSlot, selectedEmployee);
  };

  const handleCancel = () => {
    setSelectedDate(new Date());
    setSelectedTimeSlot(null);
    setSelectedEmployee("anyone");
    onClose();
  };

  const availableTimeSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  return (
    <Dialog open={isOpen} onClose={handleCancel} fullWidth maxWidth="sm">
      <div className={classes.root}>
        <DialogTitle>Booking Form</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className={classes.input}
                renderInput={(props) => <TextField {...props} />}
                label="Select a date"
                value={selectedDate}
                onChange={handleDateChange}
                minDate={dayjs(new Date())}
              />
            </LocalizationProvider>
            <Grid item xs={12}>
              <TimeSlotSelect availableTimeSlots={availableTimeSlots} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="employee-select-label">
                  Select an Employee
                </InputLabel>
                <Select
                  labelId="employee-select-label"
                  value={selectedEmployee}
                  onChange={handleEmployeeSelect}
                >
                  <MenuItem value="anyone">Anyone</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Service Information</Typography>
              <Typography variant="subtitle1">{service.name}</Typography>
              <Typography variant="body2">{service.description}</Typography>
              <Typography variant="subtitle2">{`Price: ${service.price}$`}</Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            color="primary"
            onClick={handleSave}
            disabled={!selectedTimeSlot}
          >
            Save
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};
export default BookingModal;
