import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CompanyMap from "../../components/Company/CompanyMap";
// TODO: Adjust the time formats on the availablity and length so it matches AM/PM
const ServiceCard = ({ service }) => {
  const { name, price, length } = service;

  return (
    <div className="flex justify-between items-center p-4 border border-gray-500 rounded-lg mb-4">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{length} min</p>
      </div>
      <div>
        <p className="text-xl font-semibold">${price}</p>
        <button className="bg-skyblue text-sm rounded-lg w-16 h-10 hover:bg-sky-600">
          Book
        </button>
      </div>
    </div>
  );
};

const Company = () => {
  const location = useLocation();
  const companyName = location.state.company.name;
  const [branch, setBranch] = useState({});
  const [company, setCompany] = useState({});
  const [services, setServices] = useState({});
  console.log(companyName);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/company/name`,
          {
            params: {
              name: companyName,
            },
          }
        );
        setCompany(res.data.company);
        setBranch(res.data.branch);
        setServices(res.data.services);
      } catch (error) {
        toast.error("Server Error");
        console.log(error);
      }
    })();
  }, []);
  const DayBlock = ({ name, start, end }) => {
    return (
      <>
        <p className=" font-medium mb-4 text-lg text-center">
          {name}:{" "}
          <span>
            {" "}
            {start} - {end}
          </span>
        </p>
      </>
    );
  };
  console.log(company, branch, services);
  return (
    <div className="flex">
      <div className=" w-[70%] mx-6">
        {company.homePic && (
          <img src={`http://localhost:5000/${company.homePic}`} width={"90%"} />
        )}
        <h1 className="text-4xl my-4">{company.name}</h1>

        <div className="flex flex-col">
          {services.length > 0 &&
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
        </div>
      </div>
      <div className="mr-6 border-skyblue border  bg-[#282c34]  max-w-[350px]  rounded-lg">
        <div style={{ width: 350, height: 250 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              top: 0,
            }}
          >
            {branch.latitude && (
              <CompanyMap
                latitude={branch.latitude}
                longitude={branch.longitude}
              />
            )}
          </div>
        </div>
        <p className="my-6 mx-2">
          Address: <strong>{branch.address}</strong>
        </p>
        <p className="mt-2 mx-2">{company.description}</p>
        <h2 className="text-center text-2xl mt-2 font-semibold">Schedule</h2>
        <div className="w-full">
          <DayBlock
            name="Monday"
            start={company.mondayStart}
            end={company.mondayEnd}
          />
          <DayBlock
            name="Tuesday"
            start={company.tuesdayStart}
            end={company.tuesdayEnd}
          />
          <DayBlock
            name="Wednesday"
            start={company.wednesdayStart}
            end={company.wednesdayEnd}
          />
          <DayBlock
            name="Thursday"
            start={company.thursdayStart}
            end={company.thursdayEnd}
          />
          <DayBlock
            name="Friday"
            start={company.fridayStart}
            end={company.fridayEnd}
          />
          <DayBlock
            name="Saturday"
            start={company.saturdayStart}
            end={company.saturdayEnd}
          />
          <DayBlock
            name="Sunday"
            start={company.sundayStart}
            end={company.sundayEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default Company;
