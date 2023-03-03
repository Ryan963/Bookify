import React from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map = ({ longitude, latitude }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const center = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  };

  const options = {
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={20}
      options={options}
    >
      <MarkerF position={center} />
    </GoogleMap>
  ) : null;
};

export default Map;
