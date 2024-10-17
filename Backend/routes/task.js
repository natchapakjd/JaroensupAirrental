const express = require("express");
const router = express.Router();
const db = require("../db");
const cron = require("node-cron");
const isAdmin = require('../middlewares/isAdmin');

cron.schedule("0 0 * * *", () => {
  const query = `
    DELETE FROM tasks 
    WHERE isActive = 0 AND updatedAt < NOW() - INTERVAL 30 DAY`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error deleting old inactive tasks: ", err);
    } else {
      console.log(`Deleted ${result.affectedRows} old inactive tasks.`);
    }
  });
});

router.get("/task-paging", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = "SELECT * FROM tasks LIMIT ? OFFSET ?";

  db.query(query, [limit, offset], (err, result) => {
    if (err) {
      console.error("Error fetching tasks: " + err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    db.query("SELECT COUNT(*) AS total FROM tasks", (err, countResult) => {
      if (err) {
        console.error("Error counting tasks: " + err);
        return res.status(500).json({ error: "Failed to count tasks" });
      }

      const totalTasks = countResult[0].total;
      res.json({
        tasks: result,
        totalTasks,
      });
    });
  });
});

router.get("/task/:id", (req, res) => {
  const taskId = req.params.id;

  const query = "SELECT * FROM tasks WHERE task_id = ?";

  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching task: ", err);
      return res.status(500).json({ error: "Failed to fetch task" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(result[0]);
  });
});

router.get("/tasks", (req, res) => {
  const query = "SELECT * FROM tasks WHERE isActive = 1";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    res.status(200).json(result);
  });
});

router.post("/tasks", (req, res) => {
  const {
    user_id,
    description,
    task_type_id,
    quantity_used,
    address,
    appointment_date,
    latitude,
    longitude,
    rental_start_date, 
    rental_end_date,   
  } = req.body;

  const query =
    "INSERT INTO tasks (user_id, description, task_type_id, quantity_used, address, appointment_date, latitude, longitude,isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)";

  db.query(
    query,
    [
      user_id,
      description,
      task_type_id,
      quantity_used,
      address,
      appointment_date,
      latitude,
      longitude,
      1
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating task: " + err);
        return res.status(500).json({ error: "Failed to create task" });
      }

      const taskId = result.insertId;

      const rentalQuery =
        "INSERT INTO rental (task_id, rental_start_date, rental_end_date) VALUES (?, ?, ?)";

      db.query(
        rentalQuery,
        [taskId, rental_start_date, rental_end_date],
        (err) => {
          if (err) {
            console.error("Error creating rental record: " + err);
            return res.status(500).json({ error: "Failed to create rental record" });
          }

          res.status(201).json({
            task_id: taskId,
            user_id,
            description,
            task_type_id,
            quantity_used,
            address,
            appointment_date,
            latitude,
            longitude,
            rental_start_date,
            rental_end_date,
          });
        }
      );
    }
  );
});


router.put("/task/:id",(req, res) => {
  const id = req.params.id;
  console.log(req.body)
  const {
    user_id,
    description,
    task_type_id,
    quantity_used,
    address,
    appointment_date,
    latitude,
    longitude,
    status_id,
    start_date,
    finish_date,
  } = req.body;

  const query = `
    UPDATE tasks
    SET 
      user_id = ?,
      description = ?,
      task_type_id = ?,
      quantity_used = ?,
      address = ?,
      appointment_date = ?,
      latitude = ?,
      longitude = ?,
      status_id = ?,
      start_date = ?,
      finish_date = ?
    WHERE task_id = ?`;

  db.query(
    query,
    [
      user_id,
      description,
      task_type_id,
      quantity_used,
      address,
      appointment_date,
      latitude,
      longitude,
      status_id,
      start_date,
      finish_date,
      id,
    ],
    (err, result) => {
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
          task_type_id,
          quantity_used,
          address,
          appointment_date,
          latitude,
          longitude,
          status_id,
          start_date,
          finish_date,
        });
      }
    }
  );
});

router.delete("/task/:id",isAdmin,(req, res) => {
  const id = req.params.id;
  const query = "UPDATE tasks SET isActive = 0 WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error updating task to deleted: " + err);
      res.status(500).json({ error: "Failed to mark task as deleted" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(204).send();
    }
  });
});

module.exports = router;
