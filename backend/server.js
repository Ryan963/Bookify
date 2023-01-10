const express = require("express");
const cors = require("cors");
//const mysql = require("mysql");
// create mysql connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "dataset_user",
//   password: "Dominarlo",
//   database: "nodemysql",
// });

// //connect
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("MySql connected");
// });
const app = express();

// // Create DB

app.use(express.json());

// app.get("/createdb", (req, res) => {
//   let sql = "CREATE DATABASE nodemysql";
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send("Database created");
//   });
// });

// const routes = require("./routes/university");
// app.use("/", routes);

app.use(cors());
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
