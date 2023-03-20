import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import InputField from "../../components/UI/InputField";
import PlacesAutocompleteInput from "../../components/UI/PlacesAutoCompleteInput";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [address, setAddress] = useState("");

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/customer/info`,
          {
            params: {
              email: localStorage.getItem("email"),
            },
          }
        );
        const { customer } = res.data;

        console.log(customer);
        setAddress(customer.address);
        setUserInfo(customer);
      } catch (error) {
        console.log(error);
        toast.error("Could not retrieve customer");
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/customer/`,
        {
          customer: userInfo,
        }
      );
      if (res.data.success) {
        toast.success("Info has been updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not retrieve customer");
    }
  };
  return (
    <div>
      {userInfo.firstname && (
        <>
          <h1 className="text-2xl ml-12">Hi, {userInfo.firstname}</h1>
          <div className=" flex justify-center mt-12">
            <div className="ml-5">
              <>
                <InputField
                  onChange={handleChange}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={userInfo.email}
                  disabled={true}
                />
                <InputField
                  onChange={handleChange}
                  name="firstname"
                  value={userInfo.firstname}
                  placeholder="Enter Name"
                  type="text"
                />
                <InputField
                  onChange={handleChange}
                  name="lastname"
                  value={userInfo.lastname}
                  placeholder="Enter Name"
                  type="text"
                />

                <InputField
                  onChange={handleChange}
                  name="number"
                  placeholder="Enter number"
                  value={userInfo.number}
                  type="string"
                />
                <PlacesAutocompleteInput
                  address={address}
                  setAddress={setAddress}
                  setInfo={setUserInfo}
                />
                <div className="items-center flex justify-center">
                  <div className="w-[30%] mt-4 py-4">
                    <ButtonPrimary onClick={handleSubmit}>
                      Save Information
                    </ButtonPrimary>
                  </div>
                </div>
              </>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
