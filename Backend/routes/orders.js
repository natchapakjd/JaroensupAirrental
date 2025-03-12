const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');


router.get("/v1/orders", (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // จำนวนรายการต่อหน้า
  const page = parseInt(req.query.page) || 1; // หน้าเริ่มต้น
  const offset = (page - 1) * limit; // การคำนวณ offset

  let query = `
      SELECT 
          o.id AS order_id, 
          o.created_at, 
          t.task_id, 
          t.task_type_id, 
          st.status_id,
          st.status_name, 
          oi.product_id, 
          oi.product_name, 
          oi.quantity, 
          oi.price,
          o.total_price,
          u.firstname,
          u.lastname
      FROM orders o
      JOIN tasks t ON t.task_id = o.task_id
      JOIN status st ON st.status_id = t.status_id
      JOIN users u ON o.user_id = u.user_id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LIMIT ? OFFSET ?
  `;
  
  db.query(query, [limit, offset], (err, result) => {
      if (err) {
          console.error("Error fetching orders: ", err);
          return res.status(500).json({ error: "Failed to fetch orders" });
      }

      // นับจำนวนรายการทั้งหมด
      const countQuery = "SELECT COUNT(*) AS total FROM orders";
      db.query(countQuery, (err, countResult) => {
          if (err) {
              console.error("Error fetching order count: ", err);
              return res.status(500).json({ error: "Failed to fetch order count" });
          }

          const totalCount = countResult[0].total;
          const totalPages = Math.ceil(totalCount / limit);

          // จัดกลุ่ม orders พร้อมรวมข้อมูล order_items
          const orders = result.reduce((acc, row) => {
              const orderId = row.order_id;

              if (!acc[orderId]) {
                  acc[orderId] = {
                      order_id: orderId,
                      created_at: row.created_at,
                      status_id: row.status_id,
                      task_id: row.task_id,
                      task_type_id: row.task_type_id,
                      total_price: row.total_price,
                      status_name: row.status_name,
                      firstname: row.firstname,
                      lastname: row.lastname,
                      items: []
                  };
              }

              if (row.product_id) {
                  acc[orderId].items.push({
                      product_id: row.product_id,
                      product_name: row.product_name,
                      quantity: row.quantity,
                      price: row.price,
                      total_price: row.total_price
                  });
              }
              return acc;
          }, {});

          res.status(200).json({
              totalCount,
              totalPages,
              currentPage: page,
              orders: Object.values(orders),
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

  // Query สำหรับดึงข้อมูลออเดอร์
  let query = `
    SELECT 
        o.id AS order_id, 
        o.created_at, 
        t.task_id, 
        t.task_type_id, 
        st.status_id,
        st.status_name, 
        o.total_price,
        u.firstname,
        u.lastname
    FROM orders o
    JOIN tasks t ON t.task_id = o.task_id
    JOIN status st ON st.status_id = t.status_id
    JOIN users u ON o.user_id = u.user_id
    WHERE o.user_id = ?
    LIMIT ? OFFSET ?
  `;

  // Query สำหรับดึงรายการสินค้า
  const itemsQuery = `
    SELECT 
        oi.order_id, 
        oi.product_id, 
        oi.product_name, 
        oi.quantity, 
        oi.price
    FROM order_items oi
    WHERE oi.order_id IN (?)
  `;

  // Query สำหรับนับจำนวนออเดอร์ทั้งหมด
  const countQuery = `
    SELECT COUNT(DISTINCT o.id) AS total 
    FROM orders o 
    WHERE o.user_id = ?
  `;

  // ดึงข้อมูลออเดอร์
  db.query(query, [userId, limit, offset], (err, ordersResult) => {
    if (err) {
      console.error("Error fetching orders: ", err);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    // ดึง order_ids จาก ordersResult
    const orderIds = ordersResult.map((order) => order.order_id);

    // ดึงรายการสินค้าสำหรับออเดอร์เหล่านี้
    db.query(itemsQuery, [orderIds], (err, itemsResult) => {
      if (err) {
        console.error("Error fetching order items: ", err);
        return res.status(500).json({ error: "Failed to fetch order items" });
      }

      // รวมข้อมูลออเดอร์และรายการสินค้า
      const orders = ordersResult.map((order) => {
        order.items = itemsResult.filter((item) => item.order_id === order.order_id);
        return order;
      });

      // นับจำนวนออเดอร์ทั้งหมด
      db.query(countQuery, [userId], (err, countResult) => {
        if (err) {
          console.error("Error fetching order count: ", err);
          return res.status(500).json({ error: "Failed to fetch order count" });
        }

        const totalOrders = countResult[0].total;
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
          totalOrders,
          totalPages,
          currentPage: page,
          orders,
        });
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
      "INSERT INTO tasks (user_id, description, created_at, task_type_id, quantity_used,isActive) VALUES (?, ?, ?, ?, ?,?)",
      [
        taskData.user_id,
        taskData.description,
        taskData.created_at,
        taskData.task_type_id,
        taskData.quantity_used,
        taskData.isActive
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
                  .json({ message: "Order created successfully", orderId ,taskId});
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
      SELECT o.id AS order_id, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.total_price,
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
        SELECT o.id AS order_id, o.user_id, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.total_price,u.firstname,u.lastname
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN users u ON o.user_id = u.user_id
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
          firstname: result[0].firstname,
          lastname: result[0].lastname,
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
  
  router.put("/v2/orders/:orderId", (req, res) => {
    const { orderId } = req.params; // Extract orderId from the URL parameter
    const { user_id, items, total_price } = req.body;
    
    console.log(req.body)
    console.log(orderId)
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }
  
    // Update the task (assuming it's related to this order)
    const taskData = {
      user_id: user_id,
      description: "ซื้อขายอุปกรณ์",
      task_type_id: 9,
      isActive: 1,
      updated_at: new Date(),
      quantity_used: items.reduce((total, item) => total + item.quantity, 0),
    };

    db.query(
      "UPDATE tasks SET user_id = ?, description = ?, task_type_id = ?, quantity_used = ?, isActive = ?, updatedAt = ? WHERE task_id = (SELECT task_id FROM orders WHERE id = ?)",
      [
        taskData.user_id,
        taskData.description,
        taskData.task_type_id,
        taskData.quantity_used,
        taskData.isActive,
        taskData.updated_at,
        orderId,
      ],
      (err) => {
        if (err) return res.status(500).send(err);
  
        // Update the order
        db.query(
          "UPDATE orders SET user_id = ?, total_price = ? WHERE id = ?",
          [user_id, total_price, orderId],
          (err) => {
            if (err) return res.status(500).send(err);
  
            // Delete existing order items and insert updated ones
            db.query(
              "DELETE FROM order_items WHERE order_id = ?",
              [orderId],
              (err) => {
                if (err) return res.status(500).send(err);
  
                const orderItems = items.map((item) => [
                  orderId,
                  item.product_id,
                  item.name,
                  item.quantity,
                  item.price,
                  item.total_price,
                ]);
  
                // Insert new order items
                db.query(
                  "INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total_price) VALUES ?",
                  [orderItems],
                  (err) => {
                    if (err) return res.status(500).send(err);
  
                    res.status(200).json({ message: "Order updated successfully", orderId });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
  
  router.get("/v3/orders/:id", (req, res) => {
    const order_id = req.params.id;
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;
  
    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }
  
    const query = `
      SELECT 
        o.id AS order_id, 
        o.created_at, 
        oi.product_id, 
        oi.product_name, 
        oi.quantity, 
        oi.total_price, 
        oi.price, 
        o.user_id,
        p.stock_quantity
      FROM 
        orders o
      JOIN 
        order_items oi ON o.id = oi.order_id
      JOIN 
        products p ON oi.product_id = p.product_id
      WHERE 
        o.id = ?
      LIMIT ? OFFSET ?
    `;
  
    db.query(query, [order_id, limit, offset], (err, result) => {
      if (err) return res.status(500).send(err);
  
      // Get the total count of items in order_items for the specified order
      db.query(
        `
        SELECT COUNT(*) AS total_items 
        FROM order_items oi
        WHERE oi.order_id = ?
        `,
        [order_id],
        (err, countResult) => {
          if (err) return res.status(500).send(err);
  
          const totalItems = countResult[0].total_items || 0;
  
          const orders = result.reduce((acc, row) => {
            const orderId = row.order_id;
  
            if (!acc[orderId]) {
              acc[orderId] = {
                order_id: orderId,
                created_at: row.created_at,
                user_id: row.user_id, // Include user_id in the response
                items: [],
              };
            }
  
            acc[orderId].items.push({
              product_id: row.product_id,
              product_name: row.product_name,
              quantity: row.quantity,
              total_price: row.total_price,
              price: row.price,
              stock_quantity: row.stock_quantity, // Include stock_quantity
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
  
  router.get("/v4/orders", (req, res) => {
    const taskId = req.query.taskId; // Receive taskId as query parameter
    const page = parseInt(req.query.page) || 1; // Pagination - Default page 1
    const limit = parseInt(req.query.limit) || 10; // Pagination - Default limit 10
    const offset = (page - 1) * limit;
  
    if (taskId) {
      // Query to fetch order details by taskId
      const query = `
        SELECT o.id AS order_id, o.user_id, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.total_price, u.firstname, u.lastname
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN users u ON o.user_id = u.user_id
        WHERE o.task_id = ?  -- Search by task_id
      `;
    
      db.query(query, [taskId], (err, result) => {
        if (err) return res.status(500).send(err);
  
        if (result.length === 0) {
          return res.status(404).json({ message: "Order not found." });
        }
  
        // Structure the order response
        const order = {
          order_id: result[0].order_id,
          user_id: result[0].user_id,
          firstname: result[0].firstname,
          lastname: result[0].lastname,
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
      // If no taskId, return paginated orders
      const query = `
        SELECT o.id AS order_id, o.user_id, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.total_price, o.task_id
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        LIMIT ? OFFSET ?  -- Paginate the orders
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
                task_id: row.task_id,
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
  
  router.put("/v2/orders/approve/:orderId", async (req, res) => {
    const orderId = req.params.orderId;
  
    try {
      // ดึงข้อมูลรายการสินค้าในออเดอร์
      const getOrderDetailsQuery = `
        SELECT oi.product_id, oi.quantity
        FROM order_items oi
        WHERE oi.order_id = ?
      `;
  
      db.query(getOrderDetailsQuery, [orderId], (err, detailsResult) => {
        if (err) {
          console.error("Error retrieving order details:", err);
          return res.status(500).json({ error: "Error retrieving order details" });
        }
  
        if (detailsResult.length === 0) {
          return res.status(404).json({ error: "Order details not found" });
        }
  
        // อัปเดตสถานะของออเดอร์ในตาราง tasks (สมมติว่า status_id = 4 คือสถานะ "อนุมัติ")
        const approveQuery = `
          UPDATE tasks
          SET status_id = 4
          WHERE task_id = (
            SELECT task_id
            FROM orders
            WHERE id = ?
          )
        `;
  
        db.query(approveQuery, [orderId], (error, results) => {
          if (error) {
            console.error("Error approving order:", error);
            return res.status(500).json({ error: "Error approving order" });
          }
  
          // ลดจำนวนสินค้าในสต็อกตามจำนวนที่สั่งซื้อในออเดอร์
          detailsResult.forEach((detail) => {
            const decreaseQuantityQuery = `
              UPDATE products
              SET stock_quantity = stock_quantity - ?
              WHERE product_id = ?
            `;
  
            db.query(decreaseQuantityQuery, [detail.quantity, detail.product_id], (err) => {
              if (err) {
                console.error("Error decreasing product quantity:", err);
                return res.status(500).json({ error: "Error decreasing product quantity" });
              }
            });
          });
  
          // ส่งข้อความตอบกลับว่าออเดอร์ถูกอนุมัติและสต็อกถูกอัปเดตแล้ว
          res.status(200).json({ message: "Order approved and stock updated" });
        });
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
