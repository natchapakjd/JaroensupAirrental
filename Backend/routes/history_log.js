const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

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



router.get("/borrowingLogs", (req, res) => {
  const query = "SELECT * FROM equipment_borrowing_log";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching borrowing logs: " + err);
      res.status(500).json({ error: "Failed to fetch borrowing logs" });
    } else {
      res.json(result);
    }
  });
});

router.get("/borrowingLog/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM equipment_borrowing_log WHERE log_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching borrowing log: " + err);
      res.status(500).json({ error: "Failed to fetch borrowing log" });
    } else {
      res.json(result[0]); 
    }
  });
});

router.post("/borrowingLog", isAdmin, (req, res) => {
  const { borrowing_id, action, quantity, tech_id } = req.body;

  if (!borrowing_id || !action || quantity === undefined || !tech_id) {
    return res.status(400).json({ error: "borrowing_id, action, quantity, and tech_id are required" });
  }

  const query = "INSERT INTO equipment_borrowing_log (borrowing_id, action, quantity, tech_id) VALUES (?, ?, ?, ?)";
  
  db.query(query, [borrowing_id, action, quantity, tech_id], (err, result) => {
    if (err) {
      console.error("Error logging borrowing action: " + err);
      res.status(500).json({ error: "Failed to log borrowing action" });
    } else {
      res.status(201).json({ message: "Borrowing action logged successfully", log_id: result.insertId });
    }
  });
});

router.put("/borrowingLog/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  const { borrowing_id, action, quantity, tech_id } = req.body;

  const query = "UPDATE equipment_borrowing_log SET borrowing_id = ?, action = ?, quantity = ?, tech_id = ? WHERE log_id = ?";

  db.query(query, [borrowing_id, action, quantity, tech_id, id], (err, result) => {
    if (err) {
      console.error("Error updating borrowing log: " + err);
      res.status(500).json({ error: "Failed to update borrowing log" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Borrowing log not found" });
    } else {
      res.json({ message: "Borrowing log updated successfully" });
    }
  });
});

router.delete("/borrowingLog/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM equipment_borrowing_log WHERE log_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting borrowing log: " + err);
      res.status(500).json({ error: "Failed to delete borrowing log" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Borrowing log not found" });
    } else {
      res.json({ message: "Borrowing log deleted successfully" });
    }
  });
});

module.exports = router;
