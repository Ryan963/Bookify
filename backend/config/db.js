const mysql = require("mysql");
const pool = mysql.createPool({
  host: process.env.HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "Bookify",
});
module.exports = pool;
