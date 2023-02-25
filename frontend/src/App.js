import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import AdminHome from "./pages/admin/AdminHome";
import Home from "./pages/public/Home";
import PrivateAdminRoute from "./components/routing/PrivateAdminRoute";
import PrivateEmployeeRoute from "./components/routing/PrivateEmployeeRoute";
import PrivateCustomerRoute from "./components/routing/PrivateCustomerRoute";
import CompanyRegister from "./pages/company/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/UI/NavBar";
import { ProSidebarProvider } from "react-pro-sidebar";
import SideBar from "./components/UI/SideBar";
import Branches from "./pages/employee/Branches";
import Employees from "./pages/employee/Employees";
import Services from "./pages/employee/Services";
import Search from "./pages/public/Search";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const width = window.innerWidth;
  return (
    <>
      <Router>
        <ProSidebarProvider>
          <ToastContainer />
          <div>
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div
              style={{
                width: isOpen ? width - 257 : width,
                transition: "margin-left 0.3s ease-out",
              }}
              className={`${
                isOpen ? "ml-64" : "mx-0"
              } h-screen absolute top-0 `}
            >
              <NavBar open={isOpen} setIsOpen={setIsOpen} />
              <div className="mt-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/employee/login" element={<EmployeeLogin />} />
                  <Route
                    path="/company/register"
                    element={<CompanyRegister />}
                  />
                  {/* all customer routes goes in here */}
                  <Route element={<PrivateCustomerRoute />}></Route>
                  {/* all employee routes goes in here */}
                  <Route element={<PrivateEmployeeRoute />}>
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/branches" element={<Branches />} />
                    <Route path="/services" element={<Services />} />
                  </Route>
                  {/* all admin routes goes in here */}
                  <Route element={<PrivateAdminRoute />}>
                    <Route path="/admin/home" element={<AdminHome />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </div>
        </ProSidebarProvider>
      </Router>
    </>
  );
}

export default App;
