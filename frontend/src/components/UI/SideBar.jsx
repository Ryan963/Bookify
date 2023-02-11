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

const SideBar = ({ isOpen, setIsOpen }) => {
  const { collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl } =
    useProSidebar();

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
      } absolute top-0 left-0 h-screen w-64 bg-dark z-10 h-screen`}
    >
      <Menu>
        <MenuItem className="hover:text-black"> Pie charts </MenuItem>
        <MenuItem className="hover:text-black"> Line charts </MenuItem>
        <MenuItem className="hover:text-black"> Documentation </MenuItem>
        <MenuItem className="hover:text-black"> Calendar </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
