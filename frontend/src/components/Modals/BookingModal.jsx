import React, { useEffect, useState } from "react";
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
import useEmployees from "../../hooks/useEmployees";
import { convertTime } from "../../helpers/convert-times";
import axios from "axios";
import { toast } from "react-toastify";
import ButtonPrimary from "../UI/ButtonPrimary";
import LoginModal from "./CustomerLoginModal";
import RegisterModal from "./CustomerRegisterModal";

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

const BookingModal = ({ company, isOpen, onClose, onSave }) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("anyone");
  const [employees, setEmployees] = useEmployees(company.id, [company]);
  console.log(employees);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

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

  useEffect(() => {
    (async () => {
      if (company && company.service) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/search/slots`,
            {
              params: {
                companyId: company.id,
                branchId: company.branchId,
                service: company.service,
                employeeId:
                  selectedEmployee === "anyone" ? null : selectedEmployee.id,
                selectedDate: selectedDate,
              },
            }
          );
          console.log(res.data);
          setAvailableTimeSlots(res.data.availableSlots);
        } catch (error) {
          toast.error("Could not retrieve the time slots");
          console.log(error);
        }
      }
    })();
    console.log(company);
  }, [company, selectedEmployee, selectedDate]);

  const bookAppointment = async () => {
    const userEmail = localStorage.getItem("email");
    const userType = localStorage.getItem("type");
    const userExists = userEmail && userEmail.length !== 0;
    console.log(userEmail);
    console.log("heello", selectedDate, selectedEmployee, selectedTimeSlot);
    const isCustomer = userType && userType.toLowerCase() !== "customer";
    if (userExists && isCustomer) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/booking`,
          {
            customerEmail: userEmail,
            booking: {
              serviceId: company?.service.id,
              companyId: company.id,
              employeeId:
                selectedEmployee === "anyone" ? null : selectedEmployee?.id,
              branchId: company.branchId,
              date: new Date(selectedDate),
              startTime: selectedTimeSlot[0],
              endTime: selectedTimeSlot[1],
              cancelled: false,
            },
          }
        );
        if (res.data.success) {
          toast.success("Your appointment has been booked successfully");
        } else {
          toast.error("Your request could not be completed at this time");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      setOpenLoginModal(true);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel} fullWidth maxWidth="sm">
      {company.service && (
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
                <TimeSlotSelect
                  selectedTimeSlot={selectedTimeSlot}
                  setSelectedTimeSlot={setSelectedTimeSlot}
                  availableTimeSlots={availableTimeSlots}
                />
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
                    {employees
                      .filter(
                        (employee) => employee.branchId === company.branchId
                      )
                      .map((employee) => (
                        <MenuItem key={employee.id} value={employee}>
                          {employee.firstname} {employee.lastname}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Service Information</Typography>
                <Typography variant="subtitle1">
                  {company.service.name}
                </Typography>
                <Typography variant="body2">
                  {company.service.description}
                </Typography>
                <Typography variant="subtitle2">{`Price: ${company.service.price}$`}</Typography>
                <Typography variant="subtitle2">{`Length: ${convertTime(
                  company.service.length
                )}`}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <div className="my-4 mx-4">
            <ButtonPrimary onClick={bookAppointment}>
              Book Appointment
            </ButtonPrimary>
          </div>
        </div>
      )}
      <LoginModal
        open={openLoginModal}
        setOpen={setOpenLoginModal}
        switchToRegister={() => {
          setOpenLoginModal(false);
          setOpenRegisterModal(true);
        }}
      />
      <RegisterModal
        open={openRegisterModal}
        setOpen={setOpenRegisterModal}
        switchToLogin={() => {
          setOpenLoginModal(true);
          setOpenRegisterModal(false);
        }}
      />
    </Dialog>
  );
};
export default BookingModal;
