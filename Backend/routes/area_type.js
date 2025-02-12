const express = require('express');
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

// Get all area calculations
router.get("/area-types", (req, res) => {
    const query = "SELECT * FROM room_types";
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching room_types: " + err);
        res.status(500).json({ error: "Failed to fetch room_types" });
      } else {
        res.json(result);
      }
    });
});


module.exports = router;
