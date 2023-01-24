const express = require("express");
const router = express.Router();
const {
  createEmployee,
  delEmployee,
  getEmployeesByCompany,
  updateEmployeeTable,
} = require("../controllers/employeeController");
router.post("/create", createEmployee);
router.put("/delete", delEmployee);
router.get("/", getEmployeesByCompany);
router.put("/update", updateEmployeeTable);

module.exports = router;
