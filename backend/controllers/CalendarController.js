//const bcrypt = require("bcryptjs");
const db = require("../config/db");
//const jwt = require("jsonwebtoken");

const Moment = require("moment-timezone");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

const getAppointmentsByEmpOrManager = async (req, res) => {
  const conn = await db.awaitGetConnection();
  try {
    const { email, isManager, branchId } = req.query;
    conn.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    let bookings;

    const [employee] = await conn.awaitQuery(
      "SELECT * FROM Employee WHERE email = ?",
      [email]
    );
    if (isManager && branchId) {
      const query =
        "SELECT B.id as id, B.customerId as customerId, E.firstname as employeeFirstname, E.lastname as employeeLastname, S.name as serviceName,C.firstname as customerFirstname,C.lastname as customerLastname,  B.date as date, B.startTime as startTime, B.endTime as endTime FROM Bookings B JOIN Customer C ON C.id = B.customerId JOIN Employee E ON E.id = B.employeeId JOIN Service S ON S.id = B.serviceId WHERE B.branchId = ?";
      bookings = await conn.awaitQuery(query, [branchId]);
    } else {
      const query =
        "SELECT B.id as id, B.customerId as customerId, E.firstname as employeeFirstname, E.lastname as employeeLastname, S.name as serviceName, B.date as date,C.firstname as customerFirstname,C.lastname as customerLastname, B.startTime as startTime, B.endTime as endTime FROM Bookings B JOIN Customer C ON C.id = B.customerId JOIN Employee E ON E.id = B.employeeId JOIN Service S ON S.id = B.serviceId WHERE E.email = ?";
      bookings = await conn.awaitQuery(query, [email]);
    }

    const mappedBookings = bookings.map((item, index) => {
      // const startTime = new Date(`${item.date}T${item.startTime}`);
      // const endTime = new Date(`${item.date}T${item.endTime}`);
      const date = moment(item.date).toISOString().slice(0, 10);
      const startDate = moment.tz(
        `${date} ${item.startTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "UTC"
      );

      const endDate = moment.tz(
        `${date} ${item.endTime}`,
        "YYYY-MM-DD HH:mm:ss",
        "UTC"
      );

      return {
        id: item.id,
        title: `${item.serviceName} With ${item.employeeFirstname} ${item.employeeLastname} For ${item.customerFirstname} ${item.customerLastname}`,
        start: startDate,
        end: endDate,
        employee: item.employeeFirstname + " " + item.employeeLastname,
      };
    });
    res.status(200).json({ bookings: mappedBookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  } finally {
    conn.release();
  }
};

module.exports = { getAppointmentsByEmpOrManager };
