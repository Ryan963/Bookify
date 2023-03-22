const express = require("express");
const router = express.Router();
const {
  createEmployee,
  delEmployee,
  getEmployeesByCompany,
  updateEmployeeTable,
  getEmployeeByEmail,
  loginEmp,
  getBookingsByEmployee
  

} = require("../controllers/employeeController");
router.post("/create", createEmployee);
router.put("/delete", delEmployee);
router.get("/", getEmployeesByCompany);
router.get("/booking", getBookingsByEmployee);
router.get("/:employeeEmail", getEmployeeByEmail);
router.put("/update", updateEmployeeTable);
router.post("/login", loginEmp);
module.exports = router;
