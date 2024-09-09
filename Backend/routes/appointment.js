const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/appointments", (req, res) => {
  const query = "SELECT * FROM  taskassignments ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching appointments: " + err);
      res.status(500).json({ error: "Failed to fetch appointments" });
    } else {
      res.json(result);
    }
  });
});

router.get("/appointment/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM taskassignments WHERE  appointment_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching appointment" + err);
      res.status(500).json({ error: "Failed to fetch appointment" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;