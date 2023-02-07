const express = require("express");
const router = express.Router();
const {
  createEmployee,
  delEmployee,
  getEmployeesByCompany,
  updateEmployeeTable,
  loginEmp,
} = require("../controllers/employeeController");
router.post("/create", createEmployee);
router.put("/delete", delEmployee);
router.get("/", getEmployeesByCompany);
router.put("/update", updateEmployeeTable);
router.post("/login", loginEmp);

module.exports = router;
