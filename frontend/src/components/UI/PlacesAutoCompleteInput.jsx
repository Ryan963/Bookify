import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import Geocode from "react-geocode";
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY); // Google API key
Geocode.setLanguage("en"); // Use english language
Geocode.setLocationType("ROOFTOP"); // retruns most accurate location
Geocode.enableDebug(); // enable debug
const PlacesAutocompleteInput = ({ address, setAddress, setInfo }) => {
  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = async (address) => {
    const results = await geocodeByAddress(address);
    const { lat, lng } = await getLatLng(results[0]);
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        const postalCode = response.results[0].address_components.find(
          (address) => address.types.includes("postal_code")
        ).long_name;
        setInfo((prevInfo) => {
          return {
            ...prevInfo,
            address: address,
            postalCode: postalCode,
            latitude: lat,
            longitude: lng,
          };
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div
          style={{
            width: "100%",
          }}
        >
          <input
            style={{
              width: "100%",
              marginTop: "2rem",
              padding: "0.7rem",
              borderRadius: "10px",
              outline: "none",
              border: "1px solid #4997c7",
              color: "black",
            }}
            {...getInputProps({
              placeholder: "Search Places ...",
              className: "location-search-input",
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active text-black "
                : "suggestion-item text-black";
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default PlacesAutocompleteInput;
