import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";

const ServicesSelection = ({
  services,
  selectedServices,
  setSelectedServices,
}) => {
  const handleToggle = (value) => () => {
    const currentIndex = selectedServices.indexOf(value);
    const newselectedServices = [...selectedServices];

    if (currentIndex === -1) {
      newselectedServices.push(value);
    } else {
      newselectedServices.splice(currentIndex, 1);
    }

    setSelectedServices(newselectedServices);
  };
  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          margin: "25px",
          color: "black",
          maxHeight: "200px",
          overflowY: "auto",
          border: "2px solid skyblue",
          borderRadius: "10px",
        }}
      >
        {services.map((service) => {
          const labelId = `checkbox-list-label-${service}`;

          return (
            <ListItem key={service.id} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={handleToggle(service)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedServices.indexOf(service) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={service.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default ServicesSelection;
