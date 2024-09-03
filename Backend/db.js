const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost", // Only the hostname
  port: 8889, // Port number specified separately
  user: "root",
  password: "root",
  database: "test",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
