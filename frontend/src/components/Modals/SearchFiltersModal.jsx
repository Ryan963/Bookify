import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  FormControl,
  FormHelperText,
  InputLabel,
  Slider,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { makeStyles } from "@material-ui/core";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    maxHeight: "50vh",
    overflowY: "auto",
    display: "flex",
    justifyContent: "space-between",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  distanceInput: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const SearchFilters = ({ open, onClose, filters, setFilters }) => {
  const classes = useStyles();
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleMaxPriceChange = (event) => {
    const inputMaxPrice = parseFloat(event.target.value);
    if (isNaN(inputMaxPrice) || inputMaxPrice < 0) {
      setFilters({ ...filters, maxPrice: "" });
    } else {
      setFilters({ ...filters, maxPrice: inputMaxPrice });
    }
  };

  const handleDateChange = (newDate) => {
    setFilters({ ...filters, selectedDate: newDate });
  };

  const handleTimeChange = (event) => {
    setFilters({ ...filters, selectedTime: event.target.value });
  };

  const handleDistanceChange = (event, newValue) => {
    setFilters({ ...filters, distance: newValue });
  };
  const handleFilterClick = (filter) => () => setSelectedFilter(filter);

  const renderFilterContent = () => {
    switch (selectedFilter) {
      case "location":
        return (
          <div className="p-2">
            <Typography variant="h6">Location Filter</Typography>
            <FormControl className={classes.distanceInput}>
              <InputLabel id="distance-slider" className="mt-2">
                Maximum Distance (km)
              </InputLabel>
              <Slider
                aria-label="distance slider"
                value={filters.distance}
                min={5}
                max={300}
                valueLabelDisplay="auto"
                onChange={handleDistanceChange}
              />
              <FormHelperText style={{ marginTop: "16px" }}>
                Adjust the maximum distance from your location.
              </FormHelperText>
            </FormControl>
            <Button
              style={{
                marginLeft: "10px",
              }}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </div>
        );
      case "date":
        return (
          <Box p={2}>
            <Typography variant="h6" gutterBottom>
              Date & Time
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Select a date"
                  value={filters.selectedDate}
                  onChange={handleDateChange}
                  minDate={dayjs(new Date())}
                />
              </LocalizationProvider>

              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Select a starting time:
              </Typography>
              <TextField
                id="time"
                type="time"
                value={filters.selectedTime}
                onChange={handleTimeChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 1800, // 30 min
                  min: "09:00",
                  max: "23:00",
                }}
              />
            </Box>
            <div className="w-full flex justify-center mt-4">
              <Button variant="contained" color="primary">
                Save
              </Button>
            </div>
          </Box>
        );
      case "price":
        return (
          <Box>
            <TextField
              style={{
                width: "95%",
                margin: "6px",
              }}
              label="Maximum price"
              type="number"
              value={filters.maxPrice}
              onChange={handleMaxPriceChange}
              InputProps={{ inputProps: { min: 0, max: 99999, step: 0.01 } }}
            />
            <div className="w-full flex justify-center mt-4">
              <Button variant="contained" color="primary">
                Save
              </Button>
            </div>
          </Box>
        );
      default:
        return <div>Select a filter from the list</div>;
    }
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Modal className={classes.modal} open={open} onClose={onClose}>
          <Box
            style={{
              minWidth: "500px",
              minHeight: "400px",
              borderRadius: "5px",
              border: "2px solid skyblue",
              backgroundColor: "#282c34",
            }}
          >
            <List className={classes.list}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedFilter === "location"}
                  onClick={handleFilterClick("location")}
                >
                  <ListItemText primary="Location" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedFilter === "date"}
                  onClick={handleFilterClick("date")}
                >
                  <ListItemText primary="Date & Time" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedFilter === "price"}
                  onClick={handleFilterClick("price")}
                >
                  <ListItemText primary="Price" />
                </ListItemButton>
              </ListItem>
            </List>
            {renderFilterContent()}
            <div className="flex mt-4 justify-center items-center">
              <Button
                onClick={() =>
                  setFilters({
                    distance: 30,
                    selectedDate: dayjs(new Date()),
                    selectedTime: "09:00",
                    maxPrice: 0,
                  })
                }
                style={{
                  marginBottom: "5px",
                  width: "10rem",
                }}
                variant="outlined"
                color="secondary"
              >
                Reset Filters
              </Button>
            </div>
          </Box>
        </Modal>
      </ThemeProvider>
    </>
  );
};

export default SearchFilters;
