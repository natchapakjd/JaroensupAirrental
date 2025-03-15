const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get('/task-log-paging', (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) as total FROM task_log';

  const dataQuery = `
    SELECT * 
    FROM task_log tl
    JOIN tasks t ON tl.task_id  = t.task_id
    JOIN tasktypes tt ON t.task_type_id  =  tt.task_type_id
    JOIN users u ON t.user_id = u.user_id
    JOIN roles r ON u.role_id  = r.role_id
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error('Error fetching task log count:', err);
      return res.status(500).json({ error: 'Failed to fetch task log count' });
    }

    const totalLogs = countResult[0].total;

    db.query(dataQuery, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
      if (err) {
        console.error('Error fetching task logs:', err);
        return res.status(500).json({ error: 'Failed to fetch task logs' });
      }

      res.json({
        total: totalLogs,
        page: parseInt(page),
        limit: parseInt(limit),
        taskLogs: dataResult,
      });
    });
  });
});

router.get('/v2/task-log-paging/:id', async (req, res) => {
  const id = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // นับเฉพาะ task_log ที่เกี่ยวข้องกับ user_id
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM task_log tl
      JOIN tasks t ON tl.task_id = t.task_id
      WHERE t.user_id = ?
    `;
    
    const countResult = await new Promise((resolve, reject) => {
      db.query(countQuery, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const totalLogs = countResult[0].total;

    const dataQuery = `
      SELECT tl.*, t.*, tt.*, u.firstname, u.lastname ,r.*
      FROM task_log tl
      JOIN tasks t ON tl.task_id = t.task_id
      JOIN tasktypes tt ON t.task_type_id = tt.task_type_id
      JOIN users u ON t.user_id = u.user_id
      JOIN roles r ON u.role_id  = r.role_id
      WHERE t.user_id = ?
      LIMIT ? OFFSET ?
    `;

    const dataResult = await new Promise((resolve, reject) => {
      db.query(dataQuery, [id, limit, offset], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({
      total: totalLogs,
      page,
      limit,
      taskLogs: dataResult,
    });

  } catch (err) {
    console.error('Error fetching task logs:', err);
    res.status(500).json({ error: 'Failed to fetch task logs' });
  }
});

router.get('/adminLogs-paging', (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) as total FROM adminlogs';

  const dataQuery = `
    SELECT * 
    FROM adminlogs am
    JOIN users u ON am.admin_id = u.user_id
    JOIN roles r ON u.role_id = r.role_id
    LIMIT ? OFFSET ?
  `;

  // Execute the count query
  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error('Error fetching admin log count:', err);
      return res.status(500).json({ error: 'Failed to fetch admin log count' });
    }

    const totalLogs = countResult[0].total;

    // Execute the data query
    db.query(dataQuery, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
      if (err) {
        console.error('Error fetching admin logs:', err);
        return res.status(500).json({ error: 'Failed to fetch admin logs' });
      }

      res.json({
        total: totalLogs,
        page: parseInt(page),
        limit: parseInt(limit),
        adminLogs: dataResult,
      });
    });
  });
});

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

router.post('/adminLog', (req, res) => {
  const { admin_id, action } = req.body;
  const query = 'INSERT INTO adminlogs (admin_id, action) VALUES (?, ?)';
  
  db.query(query, [admin_id, action], (err, result) => {
    if (err) {
      console.error('Error creating admin log:', err);
      return res.status(500).json({ error: 'Failed to create admin log' });
    }
    res.status(201).json({ log_id: result.insertId, message: 'admin log created successfully' });
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

router.get('/task-log-by-user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const query = 'SELECT * FROM task_log WHERE user_id = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching task logs by user:', err);
      return res.status(500).json({ error: 'Failed to fetch task logs by user' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No task logs found for this user' });
    }
    res.json(results);
  });
});

module.exports = router;
