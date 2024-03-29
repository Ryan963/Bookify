import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../UI/ButtonPrimary";
const SearchItemDisplay = ({
  branches,
  openBookingModal,
  selectBookingService,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {branches.map((branch) => (
        <div className="bg-[#131d30] h-[350px]  justify-center items-center mx-20 my-6 ">
          <div className="flex items-center h-full ml-6">
            {branch.homePic && (
              <img
                src={`http://localhost:5000/${branch.homePic}`}
                width={400}
                height={400}
              />
            )}
            <div className="ml-10 flex-1 mr-6">
              <h3
                className="text-4xl font-bold text-orange-600 cursor-pointer"
                onClick={() => {
                  navigate("/company", { state: { company: branch } });
                }}
              >
                {branch.name}
              </h3>
              <h3 className="text-xl font-semibold ">{branch.branchAddress}</h3>
              {branch.services.slice(0, 3).map((service) => (
                <div key={service.name}>
                  <div className="flex justify-between mt-2">
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p>{service.description}</p>
                    </div>
                    <div className="w-16 h-12 my-2">
                      <button
                        onClick={() => {
                          selectBookingService({ ...branch, service: service });
                          openBookingModal();
                        }}
                        className="bg-skyblue text-sm rounded-lg w-16 h-10"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SearchItemDisplay;
