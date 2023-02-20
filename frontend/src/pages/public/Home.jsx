import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import InputField from "../../components/UI/InputField";
import capstonebackground from "../../utils/images/capstonebackground.jpg";
import Typewriter from "typewriter-effect";
import useServices from "../../hooks/useServices";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import SearchItemDisplay from "../../components/Home/SearchItemDisplay";
import TitleText from "../../components/UI/TitleText";
import axios from "axios";
import { toast } from "react-toastify";
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
  const [recommended, setRecommended] = useState([]);
  const tempBranches = [
    {
      companyName: "360 Barber",
      address: "543 Sherwood Park NW",
      services: [
        {
          name: "Haircut",
          description: "a deep fade with a haircut with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Beard Trim",
          description: "a skin fade on the Beard with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Wax",
          description: "we can wax any part of your body",
          length: "01:00:00",
        },
        {
          name: "Haircut",
          description: "a deep fade with a haircut with any styles possible",
          length: "01:00:00",
        },
      ],
    },
    {
      companyName: "360 Barber",
      address: "543 Sherwood Park NW",
      services: [
        {
          name: "Haircut",
          description: "a deep fade with a haircut with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Beard Trim",
          description: "a skin fade on the Beard with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Wax",
          description: "we can wax any part of your body",
          length: "01:00:00",
        },
        {
          name: "Haircut",
          description: "a deep fade with a haircut with any styles possible",
          length: "01:00:00",
        },
      ],
    },
    {
      companyName: "360 Barber",
      address: "543 Sherwood Park NW",
      services: [
        {
          name: "Haircut",
          description: "a deep fade with a haircut with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Beard Trim",
          description: "a skin fade on the Beard with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Wax",
          description: "we can wax any part of your body",
          length: "01:00:00",
        },
      ],
    },
    {
      companyName: "360 Barber",
      address: "543 Sherwood Park NW",
      services: [
        {
          name: "Haircut",
          description: "a deep fade with a haircut with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Beard Trim",
          description: "a skin fade on the Beard with any styles possible",
          length: "01:00:00",
        },
        {
          name: "Wax",
          description: "we can wax any part of your body",
          length: "01:00:00",
        },
      ],
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/search/recommend`
        );
        setRecommended(res.data.branches);
      } catch (error) {
        console.log(error);
        toast.error("Server Error");
      }
    })();
  }, []);
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
      <div className="flex flex-col justify-around mt-[40%] ">
        <div className="my-2">
          <TitleText>Top Services in Your Area</TitleText>
        </div>
        <SearchItemDisplay branches={recommended} />
      </div>
    </>
  );
};

export default Home;
