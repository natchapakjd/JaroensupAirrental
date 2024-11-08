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

router.get("/equipment-borrowings", (req, res) => {
  const query = `
    SELECT 
      eb.*, 
      t.user_id, 
      t.description as task_desc,
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
    WHERE 
      t.status_id = 1
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

router.get("/equipment-borrowing/:techId", (req, res) => {
  const techId = req.params.techId;
  const query = `
  SELECT 
    eb.*, 
    t.user_id, 
    t.description as task_desc,
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
     WHERE t.user_id = ? AND t.status_id = 1

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
        SET  t.status_id = 4
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

          res
            .status(200)
            .json({ message: "Return approved and quantity updated" });
        });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

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
        SET  t.status_id = 10
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
          SET stock_quantity = stock_quantity + 1
          WHERE product_id = ?
        `;

        db.query(decreaseQuantityQuery, [productId], (err) => {
          if (err) {
            console.error("Error decreasing product quantity:", err);
            return res
              .status(500)
              .json({ error: "Error decreasing product quantity" });
          }

          res
            .status(200)
            .json({ message: "Return approved and quantity updated" });
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

module.exports = router;
