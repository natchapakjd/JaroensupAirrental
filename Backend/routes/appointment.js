const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/appointments", (req, res) => {
  const query = "SELECT * FROM taskassignments";

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
  const id = req.params.id;
  const query = "SELECT * FROM taskassignments WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching appointment: " + err);
      res.status(500).json({ error: "Failed to fetch appointment" });
    } else {
      res.json(result);
    }
  });
});

router.post("/appointments", (req, res) => {
  const { tech_id, task_id } = req.body;
  const query = "INSERT INTO taskassignments (tech_id, task_id) VALUES (?, ?)";

  db.query(query, [tech_id, task_id], (err, result) => {
    if (err) {
      console.error("Error creating appointment: " + err);
      res.status(500).json({ error: "Failed to create appointment" });
    } else {
      res.status(201).json({ appointment_id: result.insertId });
    }
  });
});

router.put("/appointment/:id", (req, res) => {
  const id = req.params.id;
  const { tech_id, task_id } = req.body;
  const query = "UPDATE taskassignments SET tech_id = ?, task_id = ? WHERE appointment_id = ?";

  db.query(query, [tech_id, task_id, id], (err, result) => {
    if (err) {
      console.error("Error updating appointment: " + err);
      res.status(500).json({ error: "Failed to update appointment" });
    } else {
      res.status(200).json({ message: "Appointment updated successfully" });
    }
  });
});

router.delete("/appointment/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM taskassignments WHERE appointment_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting appointment: " + err);
      res.status(500).json({ error: "Failed to delete appointment" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Appointment not found" });
    } else {
      res.status(204).send();
    }
  });
});

module.exports = router;
