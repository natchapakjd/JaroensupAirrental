const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/tasktypes", (req, res) => {
  const query = "SELECT * FROM tasktypes";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching task types: " + err);
      res.status(500).json({ error: "Failed to fetch task types" });
    } else {
      res.json(result);
    }
  });
});

router.get("/tasktype/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM tasktypes WHERE task_type_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching task type: " + err);
      res.status(500).json({ error: "Failed to fetch task type" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Task type not found" });
    } else {
      res.json(result[0]);
    }
  });
});

router.post("/tasktypes", (req, res) => {
  const { name, description } = req.body;
  const query = "INSERT INTO tasktypes (type_name, description) VALUES (?, ?)";

  db.query(query, [name, description], (err, result) => {
    if (err) {
      console.error("Error creating task type: " + err);
      res.status(500).json({ error: "Failed to create task type" });
    } else {
      res.status(201).json({ task_type_id: result.insertId, name, description });
    }
  });
});

router.put("/tasktype/:id", (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const query = "UPDATE tasktypes SET type_name = ?, description = ? WHERE task_type_id = ?";

  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      console.error("Error updating task type: " + err);
      res.status(500).json({ error: "Failed to update task type" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task type not found" });
    } else {
      res.json({ task_type_id: id, name, description });
    }
  });
});

router.delete("/tasktype/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM tasktypes WHERE task_type_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting task type: " + err);
      res.status(500).json({ error: "Failed to delete task type" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task type not found" });
    } else {
      res.status(204).send(); 
    }
  });
});

module.exports = router;
