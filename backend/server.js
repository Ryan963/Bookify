const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
console.log(process.env.HOST);
const db = mysql.createConnection({
  host: process.env.HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "Bookify",
});

//connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql connected");
});
const app = express();

// // Create DB

app.use(express.json());

app.get("/", (req, res) => {
  let sql = "SELECT * FROM admin";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// const routes = require("./routes/university");
// app.use("/", routes);

app.use(cors());
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
