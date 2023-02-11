import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import InputField from "../../components/UI/InputField";
import axios from "axios";
import { toast } from "react-toastify";
const AdminLogin = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);

    axios
      .post(`http://localhost:5000/api/admin/login`, {
        email: userInfo.email,
        password: userInfo.password,
      })
      .then((res) => {
        if (res.data.success) {
          // save in localstorage: make sure to save the user type as otherwise can't access protected routes
          localStorage.setItem("email", res.data.admin.email);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("type", "admin");
          setDisabled(false);
          toast.success("Login Successful");

          // change the route to the admin page
          navigate("/admin/home");
        } else {
          console.log(res.data.message);
          toast.error("User Unauthorized");
        }
      })
      .catch(function (err) {
        console.log(err);
        setDisabled(false);
        toast.error("Server Error, Something went wrong!");
      });
  };
  return (
    <div className="flex items-center justify-center w-full mt-32  ">
      <div className="flex-0 pt-5 w pb-5 px-6 justify-center items-center rounded-lg bg-secondary">
        <form>
          <div className="flex justify-center items-center font-bold text-2xl">
            <span>Admin Login</span>
          </div>
          <hr className="m-0" />

          <div className="pr-5 pl-5">
            <InputField
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Email Address"
              value={userInfo.email}
            />
            <InputField
              onChange={handleChange}
              type={"password"}
              name="password"
              placeholder="Password"
              value={userInfo.password}
            />
            <section className={` mb-4 mt-9 flex justify-center`}>
              <ButtonPrimary
                type="submit"
                disabled={disabled}
                onClick={handleSubmit}
              >
                Login
              </ButtonPrimary>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
