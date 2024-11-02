const mysql = require("mysql");

const db = mysql.createConnection({
  host: "bv9lnhqaqmmb6bfuzy5v-mysql.services.clever-cloud.com", // Only the hostname
  port: 3306, // Port number specified separately
  user: "uwmk2ws5wtqlof85",
  password: "lLYtxiy56swzgDuumDNw",
  database: "bv9lnhqaqmmb6bfuzy5v",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
