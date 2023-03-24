const express = require("express");
const router = express.Router();
const {
  addBooking,
  getBookingsByEmployee,
} = require("../controllers/bookingController");

router.post("/", addBooking);
router.get("/employee", getBookingsByEmployee);
module.exports = router;
