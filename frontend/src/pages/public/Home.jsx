import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import InputField from "../../components/UI/InputField";
import capstonebackground from "../../utils/images/capstonebackground.jpg";
import Typewriter from "typewriter-effect";
import useServices from "../../hooks/useServices";
import ServicesSelectModal from "../../components/Modals/ServicesSelectModal";

const ServiceSuggestions = ({ search, setSearch }) => {
  const servicesArray = [
    "Barbers",
    "Oil Change",
    "Plumbers",
    "Construction Services",
    "Massage",
    "Beauty Services",
    "Car Services",
  ];
  return (
    <div className="flex">
      {servicesArray.map((service) => (
        <>
          <div
            onClick={() => setSearch(service)}
            className="hover:underline my-3 mx-8 w-fit font-semibold cursor-pointer "
          >
            <h3>{service}</h3>
          </div>
        </>
      ))}
      <div className="hover:underline my-3 mx-8 w-fit font-semibold cursor-pointer ">
        <h3>More...</h3>
      </div>
    </div>
  );
};

const Home = () => {
  const [search, setSearch] = useState("");
  const [services, setServices] = useServices();
  console.log(services);
  return (
    <>
      <div
        className="w-full top-0 absolute h-[70%] z-0 flex justify-center items-center flex-col"
        style={{
          backgroundImage: `url(${capstonebackground})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="text-2xl font-semibold">
          <Typewriter
            options={{
              autoStart: true,
              loop: true,
              delay: 100,
              size: 20,
              strings: [
                "Be Confident!",
                "Save Time!",
                "Find The Best Service!",
                "Book Your Appointment NOW!",
              ],
            }}
          />
        </div>
        <div className="w-80">
          <InputField
            placeholder={"Book your service"}
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch
            size={20}
            color="black"
            className="relative bottom-8 left-[18rem] cursor-pointer"
          />
        </div>
        <div className="absolute bottom-6 h-10 bg-secondary w-full bg-opacity-60 flex justify-center items-center">
          <ServiceSuggestions search={search} setSearch={setSearch} />
        </div>
      </div>
    </>
  );
};

export default Home;
