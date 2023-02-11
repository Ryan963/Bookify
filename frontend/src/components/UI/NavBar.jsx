import { Link, useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import React, { useState } from "react";
import { useEffect } from "react";
import SideBar from "./SideBar";
import LoginModal from "../Modals/CustomerLoginModal";
import RegisterModal from "../Modals/CustomerRegisterModal";

const Navbar = ({ isOpen, setIsOpen }) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const navigate = useNavigate();
  const user = localStorage.getItem("email");
  const type = localStorage.getItem("type");
  const userUrl = `/${type}/home/`;
  // logs out the user not matter what type he is
  const logout = () => {
    localStorage.clear();
    // navigate user back based on user type
    if (type.toLowerCase() === "user") {
      navigate("/");
    } else if (type === "admin") {
      navigate("/admin/login");
    } else {
      navigate("/employee/login");
    }
  };

  function switchToRegister() {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  }

  function switchToLogin() {
    setLoginModalOpen(true);
    setRegisterModalOpen(false);
  }
  return (
    <>
      <nav className="flex items-center justify-between p-6  sticky top-0 bg-secondary">
        <div className="flex items-center">
          <FaBars
            onClick={() => {
              setIsOpen((prevOpen) => {
                console.log(prevOpen);
                return !prevOpen;
              });
            }}
            className="cursor-pointer mr-4"
            size={22}
          />
          <Link to="/" className="text-lg font-semibold ml-4 text-skyblue">
            Bookify
          </Link>
        </div>

        <div className="flex items-center">
          {user ? (
            <>
              <Link to={userUrl} className=" mr-4 flex">
                <FaUserCircle className="w-8 h-8 mr-4" />
              </Link>
              <FaSignOutAlt
                onClick={logout}
                size={20}
                className="cursor-pointer mr-4"
                title="Sign out"
              />{" "}
            </>
          ) : (
            <>
              <div
                className=" mr-4 cursor-pointer"
                onClick={() => setLoginModalOpen(true)}
              >
                Login
              </div>
              <div
                className="cursor-pointer"
                onClick={() => setRegisterModalOpen(true)}
              >
                Register
              </div>
            </>
          )}
        </div>
      </nav>
      <LoginModal
        open={loginModalOpen}
        setOpen={setLoginModalOpen}
        switchToRegister={switchToRegister}
      />
      <RegisterModal
        open={registerModalOpen}
        setOpen={setRegisterModalOpen}
        switchToLogin={switchToLogin}
      />
    </>
  );
};

export default Navbar;
