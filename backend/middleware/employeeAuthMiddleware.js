const jwt = require("jsonwebtoken");
const db = require("../config/db");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_EMPLOYEE_SECRET);

      // get employee from the token
      const connection = await db.awaitGetConnection();
      connection.on(`error`, (err) => {
        console.error(`Connection error ${err.code}`);
      });
      const query = "SELECT * FROM Employee WHERE id = ?";
      let employee = await connection.awaitQuery(query, [decoded.id]);
      connection.release();
      if (employee.length) {
        req.employee = employee[0];
        next();
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Not authorized" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = { protect };
