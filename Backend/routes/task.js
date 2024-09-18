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
  const {
    user_id,
    description,
    task_type_id,
    product_id,
    quantity_used,
    address,
    appointment_date,
    latitude, 
    longitude, 
  } = req.body;

  const query = "INSERT INTO tasks (user_id, description, task_type_id, product_id, quantity_used, address, appointment_date, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(query, [user_id, description, task_type_id, product_id, quantity_used, address, appointment_date, latitude, longitude], (err, result) => {
    if (err) {
      console.error("Error creating task: " + err);
      res.status(500).json({ error: "Failed to create task" });
    } else {
      res.status(201).json({
        task_id: result.insertId,
        user_id,
        description,
        task_type_id,
        product_id,
        quantity_used,
        address,
        appointment_date,
        latitude, 
        longitude, 
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

router.post('/api/orders', (req, res) => {
  const { user_id, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items provided' });
  }

  db.query('INSERT INTO orders (user_id) VALUES (?)', [user_id], (err, result) => {
    if (err) return res.status(500).send(err);

    const orderId = result.insertId;

    const orderItems = items.map(item => [
      orderId,
      item.product_id,
      item.name,  
      item.quantity,
    ]);

    db.query('INSERT INTO order_items (order_id, product_id, product_name, quantity) VALUES ?', [orderItems], (err) => {
      if (err) return res.status(500).send(err);

      res.status(201).json({ message: 'Order created successfully', orderId });
    });
  });
});




router.get('/api/orders/:id', (req, res) => {
  const user_id = req.params.id; 

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const query = `
    SELECT o.id, o.created_at, oi.product_id, oi.product_name, oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.id
    WHERE o.user_id = ?
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).send(err);

    const orders = result.reduce((acc, row) => {
      const orderId = row.order_id;

      // If order does not exist in the accumulator, create a new entry
      if (!acc[orderId]) {
        acc[orderId] = {
          order_id: orderId,
          created_at: row.created_at,
          items: [],
        };
      }

      // Push the item details into the corresponding order
      acc[orderId].items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
      });

      return acc;
    }, {});

    // Send back the formatted orders
    res.status(200).json(Object.values(orders));
  });
});

module.exports = router;
