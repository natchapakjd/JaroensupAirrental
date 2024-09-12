const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/tasks", (req, res) => {
  const query = "SELECT * FROM tasks";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching tasks: " + err);
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      res.json(result);
    }
  });
});

router.get("/task/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM tasks WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching task: " + err);
      res.status(500).json({ error: "Failed to fetch task" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json(result[0]);
    }
  });
});

router.post("/tasks", (req, res) => {
  const { user_id, description, status, start_date, finish_date, task_type_id } = req.body;
  const query = "INSERT INTO tasks (user_id, description, status, start_date, finish_date, task_type_id) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(query, [user_id, description, status, start_date, finish_date, task_type_id], (err, result) => {
    if (err) {
      console.error("Error creating task: " + err);
      res.status(500).json({ error: "Failed to create task" });
    } else {
      res.status(201).json({
        task_id: result.insertId,
        user_id,
        description,
        status,
        start_date,
        finish_date,
        task_type_id
      });
    }
  });
});

router.put("/task/:id", (req, res) => {
  const id = req.params.id;
  const { user_id, description, status, start_date, finish_date, task_type_id } = req.body;
  const query = "UPDATE tasks SET user_id = ?, description = ?, status = ?, start_date = ?, finish_date = ?, task_type_id = ? WHERE task_id = ?";

  db.query(query, [user_id, description, status, start_date, finish_date, task_type_id, id], (err, result) => {
    if (err) {
      console.error("Error updating task: " + err);
      res.status(500).json({ error: "Failed to update task" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json({
        task_id: id,
        user_id,
        description,
        status,
        start_date,
        finish_date,
        task_type_id
      });
    }
  });
});

router.delete("/task/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM tasks WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting task: " + err);
      res.status(500).json({ error: "Failed to delete task" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(204).send(); 
    }
  });
});

module.exports = router;
