const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch all admin logs
router.get("/adminLogs", (req, res) => {
  const query = "SELECT * FROM adminlogs";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching adminlogs: " + err);
      res.status(500).json({ error: "Failed to fetch adminlogs" });
    } else {
      res.json(result);
    }
  });
});

router.get("/adminLog/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM adminlogs WHERE log_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching adminLog: " + err);
      res.status(500).json({ error: "Failed to fetch adminLog" });
    } else {
      res.json(result);
    }
  });
});

router.post("/adminLog", (req, res) => {
  const { admin_id, action } = req.body;

  if (!admin_id || !action) {
    return res.status(400).json({ error: "admin_id and action are required" });
  }

  const query = "INSERT INTO adminlogs (admin_id, action) VALUES (?, ?)";
  
  db.query(query, [admin_id, action], (err, result) => {
    if (err) {
      console.error("Error logging admin action: " + err);
      res.status(500).json({ error: "Failed to log admin action" });
    } else {
      res.status(201).json({ message: "Admin action logged successfully", log_id: result.insertId });
    }
  });
});

module.exports = router;
