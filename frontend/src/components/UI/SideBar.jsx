import React from "react";
import { useEffect } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
  sidebarClasses,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";

const SideBar = ({ isOpen, setIsOpen }) => {
  const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } =
    useProSidebar();
  const userType = localStorage.getItem("type");
  console.log(userType);
  useEffect(() => {
    collapseSidebar(!isOpen);
  }, [isOpen]);

  return (
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "#2b2d2e",
          border: "None",
        },
      }}
      collapseSidebar={!isOpen}
      collapsedWidth="0"
      className={`${
        isOpen ? "block" : "hidden"
      } absolute top-0 left-0  w-64 bg-dark z-10 h-screen`}
    >
      <Menu>
        {userType === "employee" && (
          <>
            <MenuItem
              component={<Link to="/employees"></Link>}
              className="hover:text-black"
            >
              Employees
            </MenuItem>
            <MenuItem
              component={<Link to="/branches"></Link>}
              className="hover:text-black"
            >
              Branches
            </MenuItem>
            <MenuItem
              component={<Link to="/services"></Link>}
              className="hover:text-black"
            >
              Services
            </MenuItem>
          </>
        )}
        {userType === "user" && (
          <>
            <MenuItem className="hover:text-black"> Pie charts </MenuItem>
            <MenuItem className="hover:text-black"> Line charts </MenuItem>
            <MenuItem className="hover:text-black"> Documentation </MenuItem>
            <MenuItem className="hover:text-black"> Calendar </MenuItem>
          </>
        )}
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
