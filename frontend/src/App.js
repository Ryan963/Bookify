import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import AdminHome from "./pages/admin/AdminHome";
import Home from "./pages/public/Home";
import PrivateAdminRoute from "./components/routing/PrivateAdminRoute";
import PrivateEmployeeRoute from "./components/routing/PrivateEmployeeRoute";
import PrivateCustomerRoute from "./components/routing/PrivateCustomerRoute";
import CompanyRegister from "./pages/company/Register";

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/company/register" element={<CompanyRegister />} />
            {/* all customer routes goes in here */}
            <Route element={<PrivateCustomerRoute />}></Route>
            {/* all employee routes goes in here */}
            <Route element={<PrivateEmployeeRoute />}></Route>
            {/* all admin routes goes in here */}
            <Route element={<PrivateAdminRoute />}>
              <Route path="/admin" element={<AdminHome />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
