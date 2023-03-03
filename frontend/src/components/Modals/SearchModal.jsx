import React, { useState } from "react";
import {
  makeStyles,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchField: {
    position: "sticky",
    minWidth: "500px",
    top: 3,
    borderTopRightRadius: "5px",
    borderTopLeftRadius: "5px",
    paddingTop: "2px",
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    color: "black",
    backgroundColor: theme.palette.background.paper,
    maxHeight: "50vh",
    overflowY: "auto",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
    minHeight: "300px",
  },
}));

const AutocompleteModal = ({ open, onClose }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  // Function to fetch search results from API
  const fetchSearchResults = async (term) => {
    if (term.length === 0) {
      setSearchResults({ businesses: [], services: [] });
      return;
    }
    // Call API to get search results
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/search/autoComplete`,
        {
          params: {
            keyword: term,
          },
        }
      );
      if (res.data.success) {
        console.log(res.data);
        setSearchResults(res.data.results);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  function handleResultClick(result) {
    onClose();
    navigate("/search", { state: { service: result } });
  }

  function handleBusinessClick(result) {
    onClose();
    navigate("/company", { state: { company: result } });
  }

  // Function to handle search term change
  const handleSearchTermChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Call API to get search results for new search term
    fetchSearchResults(term);
  };

  // Render function for search results
  const renderSearchResults = () => {
    const serviceResults = searchResults.services || [];
    const businessResults = searchResults.businesses || [];

    // Check if any results found for services and businesses
    const hasServiceResults = serviceResults.length > 0;
    const hasBusinessResults = businessResults.length > 0;

    // If no results found, display message
    if (!hasServiceResults && !hasBusinessResults) {
      return <ListItemText primary="No results found" />;
    }

    // Otherwise, display list of results
    return (
      <>
        {hasServiceResults && (
          <>
            <ListItemText
              primary="Services"
              className="text-skyblue font-semibold text-lg"
            />
            {serviceResults.map((result) => (
              <ListItem
                button
                key={result.id}
                onClick={() => handleResultClick(result)}
              >
                <ListItemText primary={result.name} />
              </ListItem>
            ))}
          </>
        )}
        {hasBusinessResults && (
          <>
            <ListItemText
              primary="Businesses"
              className="text-skyblue font-semibold text-lg"
            />
            {businessResults.map((result) => (
              <ListItem
                button
                key={result.id}
                onClick={() => handleBusinessClick(result)}
              >
                <ListItemText primary={result.name} />
              </ListItem>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <Modal className={classes.modal} open={open} onClose={onClose}>
      <div>
        <TextField
          className={classes.searchField}
          label="Search"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <List className={classes.list}>{renderSearchResults()}</List>
      </div>
    </Modal>
  );
};

export default AutocompleteModal;
