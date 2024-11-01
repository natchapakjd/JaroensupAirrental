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

router.post('/task-log', (req, res) => {
  const { task_id, user_id, action } = req.body;
  const query = 'INSERT INTO task_log (task_id, user_id, action) VALUES (?, ?, ?)';
  
  db.query(query, [task_id, user_id, action], (err, result) => {
    if (err) {
      console.error('Error creating task log:', err);
      return res.status(500).json({ error: 'Failed to create task log' });
    }
    res.status(201).json({ log_id: result.insertId, message: 'Task log created successfully' });
  });
});

router.get('/task-log', (req, res) => {
  const query = 'SELECT * FROM task_log';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching task logs:', err);
      return res.status(500).json({ error: 'Failed to fetch task logs' });
    }
    res.json(results);
  });
});

router.get('/task-log/:id', (req, res) => {
  const logId = req.params.id;
  const query = 'SELECT * FROM task_log WHERE log_id = ?';
  
  db.query(query, [logId], (err, results) => {
    if (err) {
      console.error('Error fetching task log:', err);
      return res.status(500).json({ error: 'Failed to fetch task log' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Task log not found' });
    }
    res.json(results[0]);
  });
});

router.put('/task-log/:id', (req, res) => {
  const logId = req.params.id;
  const { task_id, user_id, action } = req.body;
  const query = 'UPDATE task_log SET task_id = ?, user_id = ?, action = ? WHERE log_id = ?';

  db.query(query, [task_id, user_id, action, logId], (err, result) => {
    if (err) {
      console.error('Error updating task log:', err);
      return res.status(500).json({ error: 'Failed to update task log' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task log not found' });
    }
    res.json({ message: 'Task log updated successfully' });
  });
});

router.delete('/task-log/:id', (req, res) => {
  const logId = req.params.id;
  const query = 'DELETE FROM task_log WHERE log_id = ?';

  db.query(query, [logId], (err, result) => {
    if (err) {
      console.error('Error deleting task log:', err);
      return res.status(500).json({ error: 'Failed to delete task log' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task log not found' });
    }
    res.json({ message: 'Task log deleted successfully' });
  });
});

module.exports = router;
