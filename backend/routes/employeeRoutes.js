const express = require("express");
const router = express.Router();
const {
  createEmployee,
  delEmployee,
} = require("../controllers/employeeController");
router.post("/create", createEmployee);
router.delete("/delete", delEmployee);
module.exports = router;
