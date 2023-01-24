const mysql = require("mysql-await");
const pool = mysql.createPool({
  host: process.env.HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "Bookify",
});
module.exports = pool;
