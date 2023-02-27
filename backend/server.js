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
app.use("/api/service", require("./routes/serviceRoutes"));
app.use("/api/companyService", require("./routes/companyServiceRoute"));
app.use("/api/branch", require("./routes/branchRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/calendar", require("./routes/CalendarRoutes"));
// serve static files from the 'images' directory
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use(cors());

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
