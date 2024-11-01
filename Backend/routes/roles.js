const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');


router.get("/api/roles", (req, res) => {
  const query = "SELECT * FROM roles";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching roles: " + err);
      return res.status(500).send("Failed to fetch roles");
    }

    const roles = result.map((row) => {
      return {
        role_id: row.role_id,
        role_name: row.role_name
      };
    });

    res.json(roles);
  });
});



module.exports = router;
