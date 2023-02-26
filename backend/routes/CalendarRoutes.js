const express = require("express");
const router = express.Router();
const { getCalendar } = require("../controllers/CalendarController");

router.get("/", getCalendar);

module.exports = router;
