const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
// @desc login customer
// @route POST /api/customer/login
// @access public
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const query = "SELECT * FROM Customer WHERE email = ?";
    let customer = await connection.awaitQuery(query, [email]);
    if (customer.length > 0) {
      customer = customer[0];
    } else {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    connection.release();
    // check if customer exists nad compare passwords
    if (customer && (await bcrypt.compare(password, customer.password))) {
      res.status(200).json({
        success: true,
        customer: customer,
        token: generateToken(customer.id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc register  customer
// @route POST /api/customer
// @access public
const registerCustomer = async (req, res) => {
  try {
    // check if customer is already registered
    const { customer } = req.body;
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const query = "SELECT * FROM Customer WHERE email = ?";
    let checkcustomer = await connection.awaitQuery(query, [customer.email]);
    if (checkcustomer.length) {
      res.status(400).json({ success: false, message: "customer exists" });
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(customer.password, salt);

    const registeredCustomer = await connection.query(
      "INSERT INTO Customer SET ?",
      customer
    );

    res.status(200).json({
      success: true,
      message: "customer registered",
      token: generateToken(customer.id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};
const Moment = require("moment-timezone");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

const getAppointmentsByCustomer = async (req, res) => {
  const conn = await db.awaitGetConnection();
  try {
    const { email } = req.query;
    conn.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const query =
      "SELECT B.id as id, B.customerId as customerId, E.firstname as employeeFirstname, E.lastname as employeeLastname, S.name as serviceName, B.date as date, B.startTime as startTime, B.endTime as endTime FROM Bookings B JOIN Customer C ON C.id = B.customerId JOIN Employee E ON E.id = B.employeeId JOIN Service S ON S.id = B.serviceId WHERE C.email = ?";

    const bookings = await conn.awaitQuery(query, [email]);
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

const getCustomerInfo = async (req, res) => {
  const conn = await db.awaitGetConnection();
  try {
    const { email } = req.query;
    conn.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });

    const query = "SELECT * FROM Customer WHERE email = ?";
    const [customer] = await conn.awaitQuery(query, [email]);
    if (!customer) {
      res
        .status(400)
        .json({ message: "Could not find a customer with this email" });
    } else {
      res.status(200).json({ success: true, customer: customer });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

const updateCustomerInfo = async (req, res) => {
  const conn = await db.awaitGetConnection();
  try {
    conn.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const { customer } = req.body;
    const result = await conn.awaitQuery(
      "UPDATE Customer SET firstname = ?, lastname = ?, address = ?, postalcode = ?, longitude = ?, latitude = ?, number = ? WHERE id = ?",
      [
        customer.firstname,
        customer.lastname,
        customer.address,
        customer.postalcode,
        customer.longitude,
        customer.latitude,
        customer.number,
        customer.id,
      ]
    );
    res.status(200).json({
      success: true,
      message: "Your info has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
};

// helper function to generate token for the customer
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_USER_SECRET, {
    expiresIn: "12h",
  });
};

module.exports = {
  loginCustomer,
  registerCustomer,
  getAppointmentsByCustomer,
  getCustomerInfo,
  updateCustomerInfo,
};
