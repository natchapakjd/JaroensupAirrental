const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/tasks", (req, res) => {
  const query = "SELECT * FROM  tasks ";

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
  const id = req.params.id
  const query = "SELECT *FROM tasks WHERE  task_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching task" + err);
      res.status(500).json({ error: "Failed to fetch task" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;