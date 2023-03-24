//Add the calendar from the customer controller here
//In the const email you are passing the manager thing as well
//make an if else for the employee or manager

/*
const getCalendar = async (req, res) => {
  try {
    const data = [
      {
        serviceName: "Haircut",
        employeeName: "Filip",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-22",
      },
      {
        serviceName: "Haircut",
        employeeName: "john",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-23",
      },
      {
        serviceName: "Haircut",
        employeeName: "john",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-13",
      },
      {
        serviceName: "Haircut",
        employeeName: "john",
        startTime: "12:00:00",
        endTime: "12:30:00",
        date: "2023-02-01",
      },
    ];

    const convertedData = data.map((item, index) => {
      const startTime = new Date(`${item.date}T${item.startTime}`);
      const endTime = new Date(`${item.date}T${item.endTime}`);

      return {
        id: index + 1,
        title: `${item.serviceName} With ${item.employeeName}`,
        start: startTime,
        end: endTime,
        employee: item.employeeName,
      };
    });
    res.status(200).json({ data: convertedData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "SERVER ERROR" });
  }
};*/

const getAppointmentsByEmpOrManager = async (req, res) => {
  const conn = await db.awaitGetConnection();
  try {
    const { email, isManager } = req.query;
    conn.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    if (isManager === true) {
      const query = "SELECT B.id as id, B.customerId as customerId, E.firstname as employeeFirstname, E.lastname as employeeLastname, S.name as serviceName, B.date as date, B.startTime as startTime, B.endTime as endTime FROM Bookings B JOIN Customer C ON C.id = B.customerId JOIN Employee E ON E.id = B.employeeId JOIN Service S ON S.id = B.serviceId WHERE E.email = ?";
    } else {
      const query = "SELECT B.id as id, B.customerId as customerId, E.firstname as employeeFirstname, E.lastname as employeeLastname, S.name as serviceName, B.date as date, B.startTime as startTime, B.endTime as endTime FROM Bookings B JOIN Customer C ON C.id = B.customerId JOIN Employee E ON E.id = B.employeeId JOIN Service S ON S.id = B.serviceId WHERE E.email = ?";
    }

    const bookings = await conn.awaitQuery(query, [email]);
    const mappedBookings = bookings.map((item, index) => {
      // const startTime = new Date(`${item.date}T${item.startTime}`);
      // const endTime = new Date(`${item.date}T${item.endTime}`);
      const date = moment(item.date).toISOString().slice(0, 10);
      const startDate = moment.tz(`${date} ${item.startTime}`, "YYYY-MM-DD HH:mm:ss", "UTC");

      const endDate = moment.tz(`${date} ${item.endTime}`, "YYYY-MM-DD HH:mm:ss", "UTC");

      return {
        id: item.id,
        title: `${item.serviceName} With ${item.employeeFirstname}${item.employeeLastname}`,
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
