import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchInputBox from "../../components/Home/SearchInputBox";
import AutocompleteModal from "../../components/Modals/SearchModal";
import TitleText from "../../components/UI/TitleText";
import Spinner from "../../components/UI/Spinner";
import SearchItemDisplay from "../../components/Home/SearchItemDisplay";
import { toast } from "react-toastify";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import SearchFiltersModal from "../../components/Modals/SearchFiltersModal";
import dayjs from "dayjs";
import useLocationWithinRadius from "../../hooks/useLocationRadius";
import { Button } from "@material-ui/core";
const Search = () => {
  const location = useLocation();
  const service = location.state?.service;
  const [results, setResults] = useState([]);
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [userLocation, setUserLocation] = useState({});
  const [filters, setFilters] = useState({
    distance: 30,
    selectedDate: dayjs(new Date()),
    selectedTime: "09:00",
    maxPrice: 0,
  });
  function getLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        alert("Allow location access to get results near you.");
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  }

  async function handleLocationAccess() {
    try {
      const position = await getLocation();

      const { latitude, longitude } = position.coords;
      setUserLocation(position.coords);
      return { longitude, latitude };
      // make api request with latitude and longitude
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const { longitude, latitude } = await handleLocationAccess();
        console.log(longitude, latitude);
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/search/`,
          {
            params: {
              service,
              longitude,
              latitude,
            },
          }
        );
        if (res.data.success) {
          console.log(res.data);
          setResults(res.data.results);
        }
      } catch (error) {
        console.log(error);
        toast.error("Server Error");
      }
    })();
  }, []);

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // checks if 2 locations are within a given radius from each other
  function isLocationWithinRadius(lat1, lng1, radius, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance <= radius;
  }
  const filteredResults = results.filter((result) => {
    const serviceFound = result.services.find((s) => s.name === service.name);
    console.log(serviceFound.price, filters.maxPrice);
    if (serviceFound.price !== null) {
      console.log();
      if (
        filters.maxPrice > 0 &&
        serviceFound.price > parseFloat(filters.maxPrice)
      ) {
        return false;
      }
    }
    return isLocationWithinRadius(
      userLocation.latitude,
      userLocation.longitude,
      filters.distance,
      result.branchLatitude,
      result.branchLongitude
    );
  });
  return (
    <>
      <div className="flex items-center justify-center">
        <SearchInputBox openSearchModal={() => setOpenSearchModal(true)} />
        <div
          className="w-10 h-8 mb-6 ml-4 cursor-pointer"
          onClick={() => setOpenFiltersModal(true)}
        >
          <AdjustmentsHorizontalIcon />
        </div>
      </div>
      <TitleText>Search Results</TitleText>
      <AutocompleteModal
        open={openSearchModal}
        onClose={() => setOpenSearchModal(false)}
      />
      {results.length === 0 ? (
        <div className="flex items-center justify-center mt-20 ">
          <Spinner />
        </div>
      ) : (
        <SearchItemDisplay branches={filteredResults} />
      )}
      <AutocompleteModal
        open={openSearchModal}
        onClose={() => setOpenSearchModal(false)}
      />
      <SearchFiltersModal
        open={openFiltersModal}
        onClose={() => setOpenFiltersModal(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

export default Search;
