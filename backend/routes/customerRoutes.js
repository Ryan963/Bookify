const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  getAppointmentsByCustomer,
  getCustomerInfo,
  updateCustomerInfo,
} = require("../controllers/customerController");
router.post("/", registerCustomer);
router.post("/login", loginCustomer);
router.get("/appointments", getAppointmentsByCustomer);
router.get("/info", getCustomerInfo);
router.put("/", updateCustomerInfo);
module.exports = router;
