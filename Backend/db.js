const mysql = require("mysql");
require("dotenv").config(); 

const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
});

// const db = mysql.createConnection({
//   host: "localhost", 
//   port: "8889", 
//   user: "root", 
//   password: "root", 
//   database: "jaroensup", 
// });

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
