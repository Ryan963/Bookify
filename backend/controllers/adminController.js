const bcrypt = require("bcryptjs");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
// @desc login admin
// @route POST /api/admin/login
// @access public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });
    const query = "SELECT * FROM admin WHERE email = ?";
    let admin = await connection.awaitQuery(query, [email]);
    if (admin.length > 0) {
      admin = admin[0];
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
    connection.release();
    // check if admin exists nad compare passwords
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res
        .status(200)
        .json({ success: true, admin: admin, token: generateToken(admin.id) });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc register  admin
// @route POST /api/admin
// @access public
const registerAdmin = async (req, res) => {
  try {
    // check if admin is already registered
    const { email, password } = req.body;
    const connection = await db.awaitGetConnection();
    connection.on(`error`, (err) => {
      console.error(`Connection error ${err.code}`);
    });

    // check if admin email already exists
    const query = "SELECT * FROM admin WHERE email = ?";
    let checkAdmin = await connection.awaitQuery(query, [email]);
    if (checkAdmin.length) {
      res.status(400).json({ success: false, message: "Admin exists" });
      return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await connection.query("INSERT INTO admin SET ?", {
      email,
      password: hashedPassword,
    });

    if (admin.insertId) {
      res.status(200).json({
        success: true,
        message: "Admin registered",
        token: generateToken(admin.insertId),
      });
    } else {
      res.status(200).json({ success: false, message: "Invalid data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

// helper function to generate token for the admin
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "12h",
  });
};


module.exports = {
  loginAdmin,
  registerAdmin,
};

