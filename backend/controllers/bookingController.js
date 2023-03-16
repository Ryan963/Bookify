const e = require("express");
const db = require("../config/db");

const addBooking = async (req, res) => {
  const conn = await db.awaitGetConnection();
  try {
    conn.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const { booking, customerEmail } = req.body;
    booking.date = new Date(booking.date);
    const customerQuery = "SELECT * FROM Customer WHERE email = ?";
    const customer = await conn.awaitQuery(customerQuery, [customerEmail]);
    booking.customerId = customer[0].id;
    if (!booking.employeeId || booking.employeeId === "anyone") {
      // get all the company employees for this branch
      console.log(booking.companyId, booking.branchId);
      let companyEmployees = await conn.awaitQuery(
        "SELECT id from Employee WHERE CompanyId = ? AND branchId = ",
        [booking.companyId, booking.branchId]
      );
      companyEmployees = companyEmployees.map((employee) => employee.id);
      // now get all the employees that are booked at this time

      let bookedEmployees = await conn.awaitQuery(
        "SELECT employeeId FROM Bookings WHERE branchId = ? AND date = ?",
        [booking.branchId, new Date(booking.date)]
      );
      bookedEmployees = bookedEmployees.map((employee) => employee.employeeId);
      const availableEmployees = companyEmployees.filter(
        (id) => !bookedEmployees.includes(id)
      );
      if (availableEmployees.length === 0) {
        res.status(400).json({
          message:
            "No employees are available at this branch, please select a different branch",
        });
      }
      booking.employee = availableEmployees[0];
    }

    const query = "INSERT INTO Bookings SET ?";
    await conn.awaitQuery(query, booking);
    res.status(200).json({
      success: true,
      message: "Your Appointment has been Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
};

module.exports = { addBooking };
