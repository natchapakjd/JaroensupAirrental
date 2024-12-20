const express = require("express");
const router = express.Router();
const db = require("../db");
const cron = require("node-cron");
const isAdmin = require('../middlewares/isAdmin');

cron.schedule("0 0 * * *", () => {
  const query = `
    DELETE FROM tasks 
    WHERE isActive = 1 AND updatedAt < NOW() - INTERVAL 1 DAY`;

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

  const query = "SELECT t.*,tt.type_name ,st.status_name,st.status_id FROM tasks t JOIN status st ON t.status_id = st.status_id JOIN tasktypes tt ON t.task_type_id = tt.task_type_id LIMIT ? OFFSET ?";

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

router.get("/task-paging/:id", (req, res) => {
  const userId = req.params.id; 
  const limit = parseInt(req.query.limit) || 10; 
  const page = parseInt(req.query.page) || 1; 
  const offset = (page - 1) * limit; 

  let query = "SELECT t.*,tt.type_name ,st.status_name FROM tasks t JOIN status st ON t.status_id = st.status_id JOIN tasktypes tt ON t.task_type_id = tt.task_type_id WHERE user_id = ?"; 
  const queryParams = [userId];

  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);
  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error fetching tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    const countQuery = "SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?";
    
    db.query(countQuery, [userId], (err, countResult) => {
      if (err) {
        console.error("Error fetching task count: ", err);
        return res.status(500).json({ error: "Failed to fetch task count" });
      }

      const totalTasks = countResult[0].total; 
      res.status(200).json({
        tasks: result,        
        totalTasks: totalTasks,
      });
    });
  });
});

router.get("/tasks/paged", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      tasks.*, 
      users.username,
      tasktypes.type_name,
      status.status_name
    FROM 
      tasks
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    WHERE 
      tasks.isActive = 1
    LIMIT ? OFFSET ?;
  `;

  const countQuery = `SELECT COUNT(*) AS total FROM tasks WHERE isActive = 1`;

  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error counting tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks count" });
    }

    const total = countResult[0].total;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        console.error("Error fetching paged tasks: ", err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }

      res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        tasks: result,
      });
    });
  });
});


router.get("/task/:id", (req, res) => {
  const taskId = req.params.id;

  const query = `
    SELECT 
      tasks.*, 
      users.*,
      tasktypes.*,
      status.*
    FROM 
      tasks
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    WHERE 
      tasks.task_id = ?
  `;

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
  const query = `
    SELECT 
      tasks.*, 
      users.*,
      tasktypes.*,
      status.*
    FROM 
      tasks
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    WHERE 
      tasks.isActive = 1
  `;

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
    "INSERT INTO tasks (user_id, description, task_type_id, quantity_used, address, appointment_date, latitude,longitude,isActive) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)";

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

router.delete("/task/:id",(req, res) => {
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


router.get("/tasks/assigned/:techId", (req, res) => {
  const techId = req.params.techId;

  const query = `
    SELECT t.*, ta.assignment_id, ta.assigned_at,tt.*,st.status_name
    FROM tasks t
    JOIN taskassignments ta ON t.task_id = ta.task_id
    JOIN tasktypes tt ON t.task_type_id = tt.task_type_id
    JOIN status st ON t.status_id  = st.status_id
    WHERE ta.tech_id = ?
  `;

  db.query(query, [techId], (err, results) => {
    if (err) {
      console.error("Error fetching assigned tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch assigned tasks" });
    }

    res.status(200).json({
      tasks: results,
      count: results.length, 
    });
  });
});


router.put("/task-tech/:id", (req, res) => {
  const id = req.params.id;
  const { status_id, start_date, finish_date } = req.body;
  const query = `
    UPDATE tasks
    SET 
      status_id = ?,
      start_date = ?,
      finish_date = ?
    WHERE task_id = ?`;

  // Execute query with parameter values
  db.query(
    query,
    [status_id, start_date, finish_date, id],
    (err, result) => {
      if (err) {
        console.error("Error updating task: " + err);
        res.status(500).json({ error: "Failed to update task" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Task not found" });
      } else {
        res.json({
          message: "Task updated successfully",
          task_id: id,
          status_id,
          start_date,
          finish_date,
        });
      }
    }
  );
});

module.exports = router;
