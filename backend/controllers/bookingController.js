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

const getBookingsByEmployee = async (req, res) => {
  try {
    const { employeeId, date } = req.query;

    const connection = await db.awaitGetConnection();
    connection.on("error", (err) => {
      console.error(`Connection error ${err.code}`);
    });

    const query =
      "SELECT B.id as id, C.firstname as customerFirstname, C.lastname as customerLastname, C.number as number, E.firstname as employeeFirstname, E.lastname as employeeLastname, S.name as serviceName, B.date as date, B.startTime as startTime, B.endTime as endTime FROM Bookings B JOIN Customer C ON C.id = B.customerId JOIN Employee E ON E.id = B.employeeId JOIN Service S ON S.id = B.serviceId WHERE E.id = ? AND B.date = ?";
    const bookings = await connection.awaitQuery(query, [
      employeeId,
      date.toString(),
    ]);
    console.log(bookings);
    console.log(
      `Found ${bookings.length} bookings for employee ${employeeId} on ${date}`
    );

    connection.release();

    return res.status(200).json({
      success: true,
      bookings: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not retrieve bookings",
    });
  }
};

module.exports = { addBooking, getBookingsByEmployee };
