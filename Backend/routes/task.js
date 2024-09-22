const express = require("express");
const router = express.Router();
const db = require("../db");
const cron = require('node-cron');

cron.schedule('0 0 * * *', () => {
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
    product_id,
    quantity_used,
    address,
    appointment_date,
    latitude,
    longitude,
  } = req.body;

  const query =
    "INSERT INTO tasks (user_id, description, task_type_id, product_id, quantity_used, address, appointment_date, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      user_id,
      description,
      task_type_id,
      product_id,
      quantity_used,
      address,
      appointment_date,
      latitude,
      longitude,
    ],
    (err, result) => {
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
    }
  );
});

router.put("/task/:id", (req, res) => {
  const id = req.params.id;
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
    status,
    start_date,
    finish_date,
  } = req.body;

  const query = `
    UPDATE tasks
    SET 
      user_id = ?,
      description = ?,
      task_type_id = ?,
      product_id = ?,
      quantity_used = ?,
      address = ?,
      appointment_date = ?,
      latitude = ?,
      longitude = ?,
      status = ?,
      start_date = ?,
      finish_date = ?
    WHERE task_id = ?`;

  db.query(
    query,
    [
      user_id,
      description,
      task_type_id,
      product_id,
      quantity_used,
      address,
      appointment_date,
      latitude,
      longitude,
      status,
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
          product_id,
          quantity_used,
          address,
          appointment_date,
          latitude,
          longitude,
          status,
          start_date,
          finish_date,
        });
      }
    }
  );
});

router.delete("/task/:id", (req, res) => {
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

router.post("/api/orders", (req, res) => {
  const { user_id, items, total_price } = req.body; // Include total_price

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  // Insert order with total_price
  db.query(
    "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
    [user_id, total_price],
    (err, result) => {
      if (err) return res.status(500).send(err);

      const orderId = result.insertId;

      const orderItems = items.map((item) => [
        orderId,
        item.product_id,
        item.name,
        item.quantity,
        item.price, // Include price per item
        item.total_price, // Include total price for each item
      ]);

      // Update the query to insert price and total_price as well
      db.query(
        "INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total_price) VALUES ?",
        [orderItems],
        (err) => {
          if (err) return res.status(500).send(err);

          res
            .status(201)
            .json({ message: "Order created successfully", orderId });
        }
      );
    }
  );
});

router.get("/api/orders/:id", (req, res) => {
  const user_id = req.params.id;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const query = `
    SELECT o.id AS order_id, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.total_price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    LIMIT ? OFFSET ?
  `;

  db.query(query, [user_id, limit, offset], (err, result) => {
    if (err) return res.status(500).send(err);

    // Get the total count of items in order_items for the specified user
    db.query(
      `
      SELECT COUNT(*) AS total_items 
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ?
    `,
      [user_id],
      (err, countResult) => {
        if (err) return res.status(500).send(err);

        const totalItems = countResult[0].total_items || 0;

        // Grouping orders
        const orders = result.reduce((acc, row) => {
          const orderId = row.order_id;

          // Initialize order if not already done
          if (!acc[orderId]) {
            acc[orderId] = {
              order_id: orderId,
              created_at: row.created_at,
              items: [],
            };
          }

          // Push item details into the corresponding order
          acc[orderId].items.push({
            product_id: row.product_id,
            product_name: row.product_name,
            quantity: row.quantity,
            total_price: row.total_price, // Make sure this field exists
          });

          return acc;
        }, {});

        // Send back the formatted orders with total count of items
        res.status(200).json({
          orders: Object.values(orders),
          totalItems,
        });
      }
    );
  });
});

module.exports = router;
