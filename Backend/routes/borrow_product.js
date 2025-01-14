const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require("../middlewares/isAdmin");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("../cloundinary-config");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/borrowed-equipment-image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/equipment-borrowings-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      eb.*, 
      t.user_id, 
      t.description as task_desc,
      t.status_id as status_id,
      u.linetoken,
      u.firstname,
      u.lastname,
      st.status_name,
      p.name as product_name
    FROM 
      equipment_borrowing eb 
    JOIN 
      tasks t ON eb.task_id = t.task_id
    JOIN 
      users u ON t.user_id = u.user_id
    JOIN 
      products p ON eb.product_id = p.product_id
    JOIN status st ON t.status_id = st.status_id
    LIMIT ? OFFSET ?`;

  const countQuery = `SELECT COUNT(*) as total FROM equipment_borrowing`;

  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error fetching total count: " + err);
      return res.status(500).json({ error: "Failed to fetch total count" });
    }

    const total = countResult[0].total;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        console.error("Error fetching equipment borrowing: " + err);
        res.status(500).json({ error: "Failed to fetch equipment borrowing" });
      } else {
        res.json({ data: result, total, page: parseInt(page), limit: parseInt(limit) });
      }
    });
  });
});


router.get("/equipment-borrowings", (req, res) => {
  const query = `
    SELECT 
      eb.*, 
      t.user_id, 
      t.description as task_desc,
      t.status_id as status_id,
      u.*,
      st.status_name,
      p.name as product_name
    FROM 
      equipment_borrowing eb 
    JOIN 
      tasks t ON eb.task_id = t.task_id
    JOIN 
      users u ON t.user_id = u.user_id
    JOIN 
      products p ON eb.product_id = p.product_id
    JOIN status st ON t.status_id = st.status_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching equipment borrowing: " + err);
      res.status(500).json({ error: "Failed to fetch equipment borrowing" });
    } else {
      res.json(result);
    }
  });
});

router.get("/equipment-borrowing-paging/:techId", (req, res) => {
  const techId = req.params.techId;
  
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      eb.*, 
      t.user_id, 
      t.description AS task_desc,
      t.status_id,
      st.status_name,
      u.firstname, 
      u.lastname, 
      p.name AS product_name
    FROM 
      equipment_borrowing eb
    JOIN 
      tasks t ON eb.task_id = t.task_id
    JOIN 
      users u ON t.user_id = u.user_id
    JOIN 
      products p ON eb.product_id = p.product_id
    JOIN 
      status st ON t.status_id = st.status_id
    WHERE 
      t.user_id = ?
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM 
      equipment_borrowing eb
    JOIN 
      tasks t ON eb.task_id = t.task_id
    WHERE 
      t.user_id = ?
  `;

  // Fetch the total count for pagination
  db.query(countQuery, [techId], (err, countResult) => {
    if (err) {
      console.error("Error fetching total count:", err);
      return res.status(500).json({ error: "Failed to fetch total count" });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch the paginated data
    db.query(query, [techId, parseInt(limit), parseInt(offset)], (err, dataResult) => {
      if (err) {
        console.error("Error fetching equipment borrowing data:", err);
        return res.status(500).json({ error: "Failed to fetch equipment borrowing data" });
      }

      res.json({
        data: dataResult,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    });
  });
});


router.get("/equipment-borrowing/:techId", (req, res) => {
  const techId = req.params.techId;
  const query = `
  SELECT 
    eb.*, 
    t.user_id, 
    t.description as task_desc,
    t.status_id as status_id,
    st.status_name,
    u.*,
    p.name as product_name
  FROM 
    equipment_borrowing eb 
  JOIN 
    tasks t ON eb.task_id = t.task_id
  JOIN 
    users u ON t.user_id = u.user_id
  JOIN 
    products p ON eb.product_id = p.product_id
  JOIN 
    status st ON t.status_id = st.status_id
    WHERE t.user_id = ?

`;
  

  db.query(query, [techId], (err, result) => {
    if (err) {
      console.error("Error fetching equipment borrowing: " + err);
      res.status(500).json({ error: "Failed to fetch equipment borrowing" });
    } else {
      res.json(result);
    }
  });
});

router.post("/equipment-borrowing", upload.single("id_card_image"), async (req, res) => {
  const { tech_id, product_id, borrow_date, return_date, user_id } = req.body;
  let imageUrl = null;

  try {
    // Upload ID card image if provided
    if (req.file) {
      const idCardImage = req.file.path;

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(idCardImage, {
        folder: "image/borrowed-equipment",
      });

      imageUrl = result.secure_url;
    }

    // First, create a new task
    const taskQuery = `
      INSERT INTO tasks (task_type_id, description, isActive, user_id)
      VALUES (?, ?, ?, ?)
    `;
    const taskValues = [11, "ยืมอุปกรณฺ์", 1, user_id];

    db.query(taskQuery, taskValues, (taskError, taskResults) => {
      if (taskError) {
        return res.status(500).json({ error: "Error creating task" });
      }
      const task_id = taskResults.insertId; // Get the generated task_id

      // Then, insert the equipment borrowing record
      const borrowingQuery = `
        INSERT INTO equipment_borrowing (tech_id, product_id, borrow_date, return_date, task_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const borrowingValues = [
        tech_id,
        product_id,
        borrow_date,
        return_date,
        task_id,
        imageUrl,
      ];

      db.query(borrowingQuery, borrowingValues, (borrowingError, borrowingResults) => {
        if (borrowingError) {
          return res.status(500).json({ error: "Error borrowing equipment" });
        }

        res.status(200).json({ message: "Equipment borrowed successfully", task_id });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ฟังก์ชันสำหรับอัพเดตการอนุมัติการยืมอุปกรณ์ (Approve)
router.put("/equipment-borrowing/approve/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const getProductIdQuery = `
      SELECT eb.product_id
      FROM equipment_borrowing eb
      JOIN tasks t ON eb.task_id = t.task_id
      WHERE t.task_id = ?
    `;

    db.query(getProductIdQuery, [taskId], (err, result) => {
      if (err) {
        console.error("Error retrieving product ID:", err);
        return res.status(500).json({ error: "Error retrieving product ID" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ error: "Task or borrowing record not found" });
      }

      const productId = result[0].product_id;

      const approveQuery = `
        UPDATE equipment_borrowing eb
        JOIN tasks t ON eb.task_id = t.task_id
        SET t.status_id = 4
        WHERE t.task_id = ?
      `;

      const updateValues = [taskId];

      db.query(approveQuery, updateValues, (error, results) => {
        if (error) {
          console.error("Error approving return:", error);
          return res.status(500).json({ error: "Error approving return" });
        }

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Borrowing record or task not found" });
        }

        const decreaseQuantityQuery = `
          UPDATE products
          SET stock_quantity = stock_quantity - 1
          WHERE product_id = ?
        `;

        db.query(decreaseQuantityQuery, [productId], (err) => {
          if (err) {
            console.error("Error decreasing product quantity:", err);
            return res
              .status(500)
              .json({ error: "Error decreasing product quantity" });
          }

          // อัพเดต capacity ของ warehouse ตาม product
          const getWarehouseQuery = `
            SELECT warehouse_id FROM products WHERE product_id = ?
          `;
          
          db.query(getWarehouseQuery, [productId], (err, warehouseResult) => {
            if (err) {
              console.error("Error retrieving warehouse ID:", err);
              return res.status(500).json({ error: "Error retrieving warehouse ID" });
            }

            if (warehouseResult.length > 0) {
              const warehouseId = warehouseResult[0].warehouse_id;

              const updateWarehouseCapacityQuery = `
                UPDATE warehouses
                SET capacity = capacity - 1
                WHERE warehouse_id = ?
              `;

              db.query(updateWarehouseCapacityQuery, [warehouseId], (err) => {
                if (err) {
                  console.error("Error updating warehouse capacity:", err);
                  return res
                    .status(500)
                    .json({ error: "Error updating warehouse capacity" });
                }

                res
                  .status(200)
                  .json({ message: "Return approved, product quantity and warehouse capacity updated" });
              });
            } else {
              res
                .status(404)
                .json({ error: "Product does not belong to any warehouse" });
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ฟังก์ชันสำหรับอัพเดตการคืนอุปกรณ์ (Return)
router.put("/equipment-borrowing/return/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const getProductIdQuery = `
      SELECT eb.product_id
      FROM equipment_borrowing eb
      JOIN tasks t ON eb.task_id = t.task_id
      WHERE t.task_id = ?
    `;

    db.query(getProductIdQuery, [taskId], (err, result) => {
      if (err) {
        console.error("Error retrieving product ID:", err);
        return res.status(500).json({ error: "Error retrieving product ID" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ error: "Task or borrowing record not found" });
      }

      const productId = result[0].product_id;

      const approveQuery = `
        UPDATE equipment_borrowing eb
        JOIN tasks t ON eb.task_id = t.task_id
        SET t.status_id = 2
        WHERE t.task_id = ?
      `;

      const updateValues = [taskId];

      db.query(approveQuery, updateValues, (error, results) => {
        if (error) {
          console.error("Error approving return:", error);
          return res.status(500).json({ error: "Error approving return" });
        }

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ error: "Borrowing record or task not found" });
        }

        const increaseQuantityQuery = `
          UPDATE products
          SET stock_quantity = stock_quantity + 1
          WHERE product_id = ?
        `;

        db.query(increaseQuantityQuery, [productId], (err) => {
          if (err) {
            console.error("Error increasing product quantity:", err);
            return res
              .status(500)
              .json({ error: "Error increasing product quantity" });
          }

          // อัพเดต capacity ของ warehouse ตาม product
          const getWarehouseQuery = `
            SELECT warehouse_id FROM products WHERE product_id = ?
          `;
          
          db.query(getWarehouseQuery, [productId], (err, warehouseResult) => {
            if (err) {
              console.error("Error retrieving warehouse ID:", err);
              return res.status(500).json({ error: "Error retrieving warehouse ID" });
            }

            if (warehouseResult.length > 0) {
              const warehouseId = warehouseResult[0].warehouse_id;

              const updateWarehouseCapacityQuery = `
                UPDATE warehouses
                SET capacity = capacity + 1
                WHERE warehouse_id = ?
              `;

              db.query(updateWarehouseCapacityQuery, [warehouseId], (err) => {
                if (err) {
                  console.error("Error updating warehouse capacity:", err);
                  return res
                    .status(500)
                    .json({ error: "Error updating warehouse capacity" });
                }

                res
                  .status(200)
                  .json({ message: "Return approved, product quantity and warehouse capacity updated" });
              });
            } else {
              res
                .status(404)
                .json({ error: "Product does not belong to any warehouse" });
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/approve/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const query = "SELECT status_id FROM tasks WHERE task_id = ?";

  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching task status:", err);
      return res.status(500).json({ error: "Failed to fetch task status" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result[0]);
  });
});

router.delete("/equipment-borrowing/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM tasks WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting borrowing record: " + err);
      res.status(500).json({ error: "Failed to delete borrowing record" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Borrowing record not found" });
    } else {
      res.json({ message: "Borrowing record deleted" });
    }
  });
});

router.get("/borrowings/count/:tech_id", async (req, res) => {
  const { tech_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT tech_id, COUNT(*) AS total_borrowings
       FROM equipment_borrowing
       WHERE tech_id = ?
       GROUP BY tech_id`,
      [tech_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No borrowings found for this technician." });
    }

    res.json({
      tech_id: rows[0].tech_id,
      total_borrowings: rows[0].total_borrowings,
    });
  } catch (error) {
    console.error("Error fetching borrowings count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
