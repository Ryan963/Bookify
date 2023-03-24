const express = require("express");
const router = express.Router();
const { getAppointmentsByEmpOrManager } = require("../controllers/CalendarController");

router.get("/", getAppointmentsByEmpOrManager);

module.exports = router;
