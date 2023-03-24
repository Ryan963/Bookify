import React from "react";
import useEmployee from "../../hooks/useEmployee";
import { useState, useEffect } from "react";
import axios from "axios";
import TitleText from "../../components/UI/TitleText";
import { useNavigate } from "react-router-dom";

const EmployeeHome = () => {
  const [employee, setEmployee] = useEmployee();
  const [matchingData, setMatchingData] = useState([]);
  const Navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  console.log(employee);

  useEffect(() => {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/booking/employee`, {
        params: {
          employeeId: employee.id,
          date: today,
        },
      })
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          setMatchingData(res.data.bookings);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [employee]);

  return (
    <div className="mt-12">
      <TitleText>Hi, {employee.firstname}!</TitleText>

      <div className="mr-auto">
        <div>
          <div className="flex flex-row w-full mt-10 p-40 mr-10 justify-between ml-auto">
            <div className="w-full md:w-2/3 mx-2">
              <>
                {matchingData ? (
                  matchingData.length > 0 ? (
                    <div className="border  border-skyblue">
                      <div className="flex flex-row font-bold text-lg bg-black border-skyblue">
                        <div className="w-1/2 p-2 border border-skyblue">
                          Name
                        </div>
                        <div className="w-1/3 p-2 border border-skyblue">
                          Service
                        </div>
                        <div className="w-1/2 p-2 border border-skyblue">
                          Contact
                        </div>
                        <div className="w-1/3 p-2 border border-skyblue">
                          Start
                        </div>
                        <div className="w-1/3 p-2 border border-skyblue">
                          End{" "}
                        </div>
                      </div>

                      {matchingData.map((item) => (
                        <div key={item.name} className="flex flex-row">
                          <div className="w-1/2 p-2 border-r border-b border-skyblue">
                            {`${item.customerFirstname} ${item.customerLastname}`}
                          </div>
                          <div className="w-1/3 p-2 border-r border-b border-skyblue">
                            {item.serviceName}
                          </div>
                          <div className="w-1/2 p-2 border-r border-b border-skyblue">
                            {item.number}
                          </div>
                          <div className="w-1/3 p-2 border-r border-b border-skyblue">
                            {item.startTime}
                          </div>
                          <div className="w-1/3 p-2 border-r border-b border-skyblue">
                            {item.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-4xl mt-6 mr-10 text-center">
                      No appointments today
                    </div>
                  )
                ) : (
                  <div>Loading...</div>
                )}
              </>
              <div className="flex justify-center items-center">
                <button
                  id="myButton"
                  className="shadow-md border-skyblue bg-skyblue text-black py-2 px-4 hover:bg-skyblue mt-6"
                  onClick={() => {
                    Navigate("/calendar");
                  }}
                >
                  View Full Calendar
                </button>
              </div>
            </div>
            <div className="border-skyblue ml-[10%]">
              <div className="flex w-50">
                <div className="w-full mx-2">
                  <div className="border-skyblue border-2  min-w-50 bg-white px-14 py-8 text-black items-center flex-col ">
                    <p className="font-bold p-14 flex self-center">
                      Employee Information:
                    </p>

                    <p className="p-2">
                      <span className="mr-2">Name:</span>
                      {employee.firstname} {employee.lastName}
                    </p>
                    <p className="p-2">
                      <span className="mr-2">Email:</span>
                      {employee.email}
                    </p>
                    <p className="p-2">
                      <span className="mr-2">Phone:</span>
                      {employee.number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default EmployeeHome;
