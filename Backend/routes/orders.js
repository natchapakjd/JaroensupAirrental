const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');


router.get("/v1/orders", (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // จำนวนรายการต่อหน้า
    const page = parseInt(req.query.page) || 1; // หน้าเริ่มต้น
    const offset = (page - 1) * limit; // การคำนวณ offset

    const query = "SELECT * FROM orders LIMIT ? OFFSET ?";
  
    db.query(query, [limit, offset], (err, result) => {
        if (err) {
            console.error("Error fetching orders: ", err);
            return res.status(500).json({ error: "Failed to fetching orders" });
        }
      
        const countQuery = "SELECT COUNT(*) AS total FROM orders";
        db.query(countQuery, (err, countResult) => {
            if (err) {
                console.error("Error fetching order count: ", err);
                return res.status(500).json({ error: "Failed to fetching order count" });
            }

            const totalCount = countResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);

            res.status(200).json({
                totalCount,
                totalPages,
                currentPage: page,
                orders: result,
            });
        });
    });
});

router.get("/v3/orders", (req, res) => {
  const query = "SELECT * FROM orders";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching orders: " + err);
      res.status(500).json({ error: "Failed to fetch orders" });
    } else {
      res.json(result);
    }
  });
});

router.get("/v1/orders/:id", (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // จำนวนรายการต่อหน้า
    const page = parseInt(req.query.page) || 1; // หน้าเริ่มต้น
    const offset = (page - 1) * limit; // การคำนวณ offset
    const userId = req.params.id; // รับ user_id จาก URL parameters

    // สร้างเงื่อนไขสำหรับการค้นหาตาม user_id
    let query = "SELECT * FROM orders WHERE user_id = ?";
    const queryParams = [userId];

    query += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("Error fetching orders: ", err);
            return res.status(500).json({ error: "Failed to fetching orders" });
        }

        // นับจำนวนคำสั่งซื้อที่ตรงกับ user_id
        const countQuery = "SELECT COUNT(*) AS total FROM orders WHERE user_id = ?";
        
        db.query(countQuery, [userId], (err, countResult) => {
            if (err) {
                console.error("Error fetching order count: ", err);
                return res.status(500).json({ error: "Failed to fetching order count" });
            }

            const totalCount = countResult[0].total;
            const totalPages = Math.ceil(totalCount / limit);

            res.status(200).json({
                totalCount,
                totalPages,
                currentPage: page,
                orders: result,
            });
        });
    });
});


router.delete("/v1/orders/:id", (req, res) => {
    const orderId = req.params.id;
  
    db.query("DELETE FROM orders WHERE id = ?", [orderId], (err) => {
      if (err) {
        console.error("Error deleting order items: ", err);
        return res.status(500).json({ error: "Failed to delete order items" });
      }else{
        return res.status(200).json({message: "Delete success"})
      }
    });
  });
  

router.get("/v2/orders/count", (req, res) => {
    const query = "SELECT COUNT(*) AS total_orders FROM orders";
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error counting orders: ", err);
        return res.status(500).json({ error: "Failed to count orders" });
      }
      
      const totalOrders = result[0].total_orders;
      res.status(200).json({ totalOrders });
    });
  });
  router.post("/v2/orders", (req, res) => {
    const { user_id, items, total_price } = req.body; 
  
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }
  
    const taskData = {
      user_id: user_id,
      description: "ซื้อขายอุปกรณ์", 
      task_type_id: 9,
      isActive : 1,
      created_at: new Date(),
      quantity_used: items.reduce((total, item) => total + item.quantity, 0), 
    };
  
    db.query(
      "INSERT INTO tasks (user_id, description, created_at, task_type_id, quantity_used) VALUES (?, ?, ?, ?, ?)",
      [
        taskData.user_id,
        taskData.description,
        taskData.created_at,
        taskData.task_type_id,
        taskData.quantity_used,
      ],
      (err, taskResult) => {
        if (err) return res.status(500).send(err);
  
        const taskId = taskResult.insertId;
  
        // Insert order with total_price and task_id
        db.query(
          "INSERT INTO orders (user_id, total_price, task_id) VALUES (?, ?, ?)",
          [user_id, total_price, taskId],
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
  
            // Insert order items
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
      }
    );
  });
  
  
  router.get("/v2/orders/:id", (req, res) => {
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
  
          const orders = result.reduce((acc, row) => {
            const orderId = row.order_id;
  
            if (!acc[orderId]) {
              acc[orderId] = {
                order_id: orderId,
                created_at: row.created_at,
                items: [],
              };
            }
  
            acc[orderId].items.push({
              product_id: row.product_id,
              product_name: row.product_name,
              quantity: row.quantity,
              total_price: row.total_price, 
            });
  
            return acc;
          }, {});
  
          res.status(200).json({
            orders: Object.values(orders),
            totalItems,
          });
        }
      );
    });
  });
  
  router.get("/v2/orders", (req, res) => {
    const orderId = req.query.orderId; 
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const offset = (page - 1) * limit;
  
    if (orderId) {
      const query = `
        SELECT o.id AS order_id, o.user_id, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.total_price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.id = ?
      `;
  
      db.query(query, [orderId], (err, result) => {
        if (err) return res.status(500).send(err);
  
        if (result.length === 0) {
          return res.status(404).json({ message: "Order not found." });
        }
  
        const order = {
          order_id: result[0].order_id,
          user_id: result[0].user_id,
          created_at: result[0].created_at,
          items: result.map(row => ({
            product_id: row.product_id,
            product_name: row.product_name,
            quantity: row.quantity,
            total_price: row.total_price,
          })),
        };
  
        return res.status(200).json(order);
      });
    } else {

      const query = `
        SELECT o.id AS order_id, o.user_id, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.total_price
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        LIMIT ? OFFSET ?
      `;
  
      db.query(query, [limit, offset], (err, result) => {
        if (err) return res.status(500).send(err);
  
        db.query(`SELECT COUNT(*) AS total_items FROM orders`, (err, countResult) => {
          if (err) return res.status(500).send(err);
  
          const totalItems = countResult[0].total_items || 0;
  
          const orders = result.reduce((acc, row) => {
            const orderId = row.order_id;
  
            if (!acc[orderId]) {
              acc[orderId] = {
                order_id: orderId,
                user_id: row.user_id,
                created_at: row.created_at,
                items: [],
              };
            }
  
            acc[orderId].items.push({
              product_id: row.product_id,
              product_name: row.product_name,
              quantity: row.quantity,
              total_price: row.total_price,
            });
  
            return acc;
          }, {});
  
          res.status(200).json({
            orders: Object.values(orders),
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
          });
        });
      });
    }
  });
  



module.exports = router;
