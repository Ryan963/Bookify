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

// helper function to generate token for the customer
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_USER_SECRET, {
    expiresIn: "12h",
  });
};

module.exports = {
  loginCustomer,
  registerCustomer,
};
