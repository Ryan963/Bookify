const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
// const db = mysql.createConnection({
//   host: process.env.HOST,
//   user: "root",
//   password: process.env.DB_PASSWORD,
//   database: "Bookify",
// });

const db = require("./config/db");
//connect
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("MySql connected");
// });
const app = express();

// // Create DB

app.use(express.json());
app.use(cors());

app.get("/admin", (req, res) => {
  let sql = "SELECT * FROM admin";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/employee", require("./routes/employeeRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
