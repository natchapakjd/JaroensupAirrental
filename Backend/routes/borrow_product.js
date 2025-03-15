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

router.post("/v2/equipment-borrowing", upload.single("id_card_image"), async (req, res) => {
  const { tech_id, borrow_date, return_date, user_id, products } = req.body;
  let imageUrl = null;


  console.log("Received body:", req.body);

  try {
    if (req.file) {
      try {
        const idCardImage = req.file.path;
        const result = await cloudinary.uploader.upload(idCardImage, {
          folder: "image/borrowed-equipment",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ error: "Failed to upload image", details: uploadError.message });
      }
    }

    const taskQuery = `
      INSERT INTO tasks (task_type_id, description, isActive, user_id)
      VALUES (?, ?, ?, ?)
    `;
    const taskValues = [11, "ยืมอุปกรณ์", 1, user_id];

    db.query(taskQuery, taskValues, (taskError, taskResults) => {
      if (taskError) {
        console.error("Task Query Error:", taskError);
        return res.status(500).json({ error: "Error creating task", details: taskError.message });
      }
      const task_id = taskResults.insertId;

      const formattedBorrowDate = new Date(borrow_date).toISOString().slice(0, 19).replace("T", " ");
      const formattedReturnDate = new Date(return_date).toISOString().slice(0, 19).replace("T", " ");
      const borrowingQuery = `
        INSERT INTO equipment_borrowing (tech_id, borrow_date, return_date, task_id, image_url)
        VALUES (?, ?, ?, ?, ?)
      `;
      const borrowingValues = [tech_id, formattedBorrowDate, formattedReturnDate, task_id, imageUrl];

      db.query(borrowingQuery, borrowingValues, (borrowingError, borrowingResults) => {
        if (borrowingError) {
          console.error("Borrowing Query Error:", borrowingError);
          return res.status(500).json({ error: "Error borrowing equipment", details: borrowingError.message });
        }

        const borrowing_id = borrowingResults.insertId;

        let parsedProducts = products;
        if (typeof parsedProducts === "string") {
          parsedProducts = JSON.parse(parsedProducts);
        }
        console.log("Parsed Products:", parsedProducts);

        const detailsQuery = `
          INSERT INTO borrowing_details (borrowing_id, product_id, quantity)
          VALUES ?
        `;
        const detailsValues = parsedProducts.map((product) => [
          borrowing_id,
          product.product_id,
          product.quantity,
        ]);

        db.query(detailsQuery, [detailsValues], (detailsError) => {
          if (detailsError) {
            console.error("Details Query Error:", detailsError);
            return res.status(500).json({ error: "Error saving borrowing details", details: detailsError.message });
          }

          res.status(200).json({ message: "Equipment borrowed successfully", task_id });
        });
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/v2/equipment-borrowings-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

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
      GROUP_CONCAT(CONCAT(p.name, ' (', bd.quantity, ')')) AS products
    FROM 
      equipment_borrowing eb 
    JOIN 
      tasks t ON eb.task_id = t.task_id
    JOIN 
      users u ON eb.tech_id = u.user_id
    JOIN 
      borrowing_details bd ON eb.borrowing_id = bd.borrowing_id
    JOIN 
      products p ON bd.product_id = p.product_id
    JOIN 
      status st ON t.status_id = st.status_id
    GROUP BY eb.borrowing_id
    ORDER BY eb.borrowing_id DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(DISTINCT eb.borrowing_id) as total 
    FROM equipment_borrowing eb 
    JOIN tasks t ON eb.task_id = t.task_id
    JOIN users u ON eb.tech_id = u.user_id
    JOIN borrowing_details bd ON eb.borrowing_id = bd.borrowing_id
    JOIN products p ON bd.product_id = p.product_id
    JOIN status st ON t.status_id = st.status_id
  `;

  db.query(countQuery, (countErr, countResult) => {
    if (countErr) {
      console.error("Error fetching total count:", countErr);
      return res.status(500).json({ error: "Failed to fetch total count", details: countErr.message });
    }

    const total = countResult[0].total;

    db.query(query, [limitNum, offset], (queryErr, result) => {
      if (queryErr) {
        console.error("Error fetching equipment borrowing:", queryErr);
        return res.status(500).json({ error: "Failed to fetch equipment borrowing", details: queryErr.message });
      }

      res.json({ data: result, total, page: pageNum, limit: limitNum });
    });
  });
});

router.get("/v2/equipment-borrowing-paging/:techId", (req, res) => {
  const { techId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const offset = (pageNum - 1) * limitNum;

  const query = `
    SELECT 
      eb.*, 
      t.user_id, 
      t.description AS task_desc,
      t.status_id AS status_id,
      u.linetoken,
      u.firstname,
      u.lastname,
      st.status_name,
      GROUP_CONCAT(CONCAT(p.name, ' (', bd.quantity, ')')) AS products
    FROM 
      equipment_borrowing eb 
    JOIN 
      tasks t ON eb.task_id = t.task_id
    JOIN 
      users u ON eb.tech_id = u.user_id
    JOIN 
      borrowing_details bd ON eb.borrowing_id = bd.borrowing_id
    JOIN 
      products p ON bd.product_id = p.product_id
    JOIN 
      status st ON t.status_id = st.status_id
    WHERE 
      eb.tech_id = ?
    GROUP BY eb.borrowing_id
    ORDER BY eb.borrowing_id DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(DISTINCT eb.borrowing_id) AS total 
    FROM equipment_borrowing eb 
    JOIN tasks t ON eb.task_id = t.task_id
    JOIN users u ON eb.tech_id = u.user_id
    JOIN borrowing_details bd ON eb.borrowing_id = bd.borrowing_id
    JOIN products p ON bd.product_id = p.product_id
    JOIN status st ON t.status_id = st.status_id
    WHERE 
      eb.tech_id = ?
  `;

  // ดึงจำนวนทั้งหมดก่อน
  db.query(countQuery, [techId], (countErr, countResult) => {
    if (countErr) {
      console.error("Error fetching total count:", countErr);
      return res.status(500).json({ error: "Failed to fetch total count", details: countErr.message });
    }

    const total = countResult[0].total;

    // ดึงข้อมูลตาม pagination
    db.query(query, [techId, limitNum, offset], (queryErr, result) => {
      if (queryErr) {
        console.error("Error fetching equipment borrowing:", queryErr);
        return res.status(500).json({ error: "Failed to fetch equipment borrowing", details: queryErr.message });
      }

      res.json({ data: result, total, page: pageNum, limit: limitNum });
    });
  });
});

router.put("/v2/equipment-borrowing/approve/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const getBorrowingDetailsQuery = `
      SELECT bd.product_id, bd.quantity
      FROM borrowing_details bd
      JOIN equipment_borrowing eb ON bd.borrowing_id = eb.borrowing_id
      JOIN tasks t ON eb.task_id = t.task_id
      WHERE t.task_id = ?
    `;

    db.query(getBorrowingDetailsQuery, [taskId], (err, detailsResult) => {
      if (err) {
        console.error("Error retrieving borrowing details:", err);
        return res.status(500).json({ error: "Error retrieving borrowing details" });
      }

      if (detailsResult.length === 0) {
        return res.status(404).json({ error: "Borrowing details not found" });
      }

      // Update task status
      const approveQuery = `
        UPDATE tasks
        SET status_id = 4
        WHERE task_id = ?
      `;

      db.query(approveQuery, [taskId], (error, results) => {
        if (error) {
          console.error("Error approving borrowing:", error);
          return res.status(500).json({ error: "Error approving borrowing" });
        }

        // Decrease stock quantity for each product
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

        res.status(200).json({ message: "Borrowing approved and stock updated" });
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

router.put("/v2/equipment-borrowing/return/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const getBorrowingDetailsQuery = `
      SELECT bd.product_id, bd.quantity
      FROM borrowing_details bd
      JOIN equipment_borrowing eb ON bd.borrowing_id = eb.borrowing_id
      JOIN tasks t ON eb.task_id = t.task_id
      WHERE t.task_id = ?
    `;

    db.query(getBorrowingDetailsQuery, [taskId], (err, detailsResult) => {
      if (err) {
        console.error("Error retrieving borrowing details:", err);
        return res.status(500).json({ error: "Error retrieving borrowing details" });
      }

      if (detailsResult.length === 0) {
        return res.status(404).json({ error: "Borrowing details not found" });
      }

      // Update task status
      const returnQuery = `
        UPDATE tasks
        SET status_id = 2
        WHERE task_id = ?
      `;

      db.query(returnQuery, [taskId], (error, results) => {
        if (error) {
          console.error("Error returning equipment:", error);
          return res.status(500).json({ error: "Error returning equipment" });
        }

        // Increase stock quantity for each product
        detailsResult.forEach((detail) => {
          const increaseQuantityQuery = `
            UPDATE products
            SET stock_quantity = stock_quantity + ?
            WHERE product_id = ?
          `;

          db.query(increaseQuantityQuery, [detail.quantity, detail.product_id], (err) => {
            if (err) {
              console.error("Error increasing product quantity:", err);
              return res.status(500).json({ error: "Error increasing product quantity" });
            }
          });
        });

        res.status(200).json({ message: "Equipment returned and stock updated" });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/v3/equipment-borrowing/id/:borrowingId", (req, res) => {
  const { borrowingId } = req.params;

  const query = `
    SELECT 
      eb.*, 
      t.user_id, 
      t.description AS task_desc,
      t.status_id,
      st.status_name,
      u.firstname, 
      u.lastname,
      GROUP_CONCAT(
        JSON_OBJECT(
          'product_id', bd.product_id,
          'product_name', p.name,
          'quantity', bd.quantity
        )
      ) AS products
    FROM 
      equipment_borrowing eb
    JOIN 
      tasks t ON eb.task_id = t.task_id
    JOIN 
      users u ON t.user_id = u.user_id
    JOIN 
      borrowing_details bd ON eb.borrowing_id = bd.borrowing_id
    JOIN 
      products p ON bd.product_id = p.product_id
    JOIN 
      status st ON t.status_id = st.status_id
    WHERE 
      eb.borrowing_id = ?
    GROUP BY eb.borrowing_id
  `;

  db.query(query, [borrowingId], (err, result) => {
    if (err) {
      console.error("Error fetching borrowing record:", err);
      return res.status(500).json({ error: "Failed to fetch borrowing record" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Borrowing record not found" });
    }

    // Parse products from GROUP_CONCAT into an array
    const data = result[0];
    data.products = JSON.parse(`[${data.products}]`);
    res.json(data);
  });
});

router.get("/v4/equipment-borrowing/id/:taskId", (req, res) => {
  const { taskId } = req.params;

  const query = `
    SELECT 
      eb.*, 
      t.user_id, 
      t.description AS task_desc,
      t.status_id,
      st.status_name,
      u.firstname, 
      u.lastname,
      GROUP_CONCAT(
        JSON_OBJECT(
          'product_id', bd.product_id,
          'product_name', p.name,
          'quantity', bd.quantity
        )
      ) AS products
    FROM 
      equipment_borrowing eb
    JOIN 
      tasks t ON eb.task_id = t.task_id
    JOIN 
      users u ON t.user_id = u.user_id
    JOIN 
      borrowing_details bd ON eb.borrowing_id = bd.borrowing_id
    JOIN 
      products p ON bd.product_id = p.product_id
    JOIN 
      status st ON t.status_id = st.status_id
    WHERE 
      eb.task_id = ?
    GROUP BY eb.task_id
  `;

  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching borrowing record:", err);
      return res.status(500).json({ error: "Failed to fetch borrowing record" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Borrowing record not found" });
    }

    // Parse products from GROUP_CONCAT into an array
    const data = result[0];
    data.products = JSON.parse(`[${data.products}]`);
    res.json(data);
  });
});
router.get("/v2/equipment-borrowing/:techId", (req, res) => {
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
      users u ON eb.tech_id = u.user_id -- เชื่อมโยง tech_id กับ users(user_id)
    JOIN 
      borrowing_details bd ON eb.borrowing_id = bd.borrowing_id
    JOIN 
      products p ON bd.product_id = p.product_id
    JOIN 
      status st ON t.status_id = st.status_id
    WHERE 
      eb.tech_id = ?
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

router.delete("/v2/equipment-borrowing/:borrowingId", (req, res) => {
  const { borrowingId } = req.params;

  // เริ่ม transaction เพื่อให้การลบสมบูรณ์ทั้งหมดหรือไม่ลบเลย
  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error("Error starting transaction:", transactionErr);
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // 1. ลบข้อมูลจาก borrowing_details ก่อน (เพราะมี foreign key กับ borrowing_id)
    const deleteDetailsQuery = `
      DELETE FROM borrowing_details 
      WHERE borrowing_id = ?
    `;
    db.query(deleteDetailsQuery, [borrowingId], (detailsErr, detailsResult) => {
      if (detailsErr) {
        return db.rollback(() => {
          console.error("Error deleting borrowing details:", detailsErr);
          res.status(500).json({ error: "Failed to delete borrowing details", details: detailsErr.message });
        });
      }

      // 2. ลบข้อมูลจาก equipment_borrowing
      const deleteBorrowingQuery = `
        DELETE FROM equipment_borrowing 
        WHERE borrowing_id = ?
      `;
      db.query(deleteBorrowingQuery, [borrowingId], (borrowingErr, borrowingResult) => {
        if (borrowingErr) {
          return db.rollback(() => {
            console.error("Error deleting equipment borrowing:", borrowingErr);
            res.status(500).json({ error: "Failed to delete equipment borrowing", details: borrowingErr.message });
          });
        }

        if (borrowingResult.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: "Borrowing record not found" });
          });
        }

        // (可选) 3. ลบข้อมูลจาก tasks ถ้าต้องการ (ถ้า task_id ไม่ใช้ซ้ำใน record อื่น)
        // ถ้าไม่ต้องการลบ tasks ให้ comment ส่วนนี้ออก
        const deleteTaskQuery = `
          DELETE FROM tasks 
          WHERE task_id = (SELECT task_id FROM equipment_borrowing WHERE borrowing_id = ?)
        `;
        db.query(deleteTaskQuery, [borrowingId], (taskErr, taskResult) => {
          if (taskErr) {
            return db.rollback(() => {
              console.error("Error deleting task:", taskErr);
              res.status(500).json({ error: "Failed to delete task", details: taskErr.message });
            });
          }

          // Commit transaction ถ้าทุกอย่างสำเร็จ
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                console.error("Error committing transaction:", commitErr);
                res.status(500).json({ error: "Failed to commit transaction" });
              });
            }
            res.json({ message: "Equipment borrowing deleted successfully" });
          });
        });
      });
    });
  });
});

router.put("/v4/equipment-borrowing/id/:borrowingId", (req, res) => {
  const { borrowingId } = req.params;
  const { tech_id, borrow_date, return_date, products } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!tech_id || !borrow_date || !return_date || !products || !Array.isArray(products)) {
    return res.status(400).json({ error: "Missing or invalid required fields" });
  }

  // เริ่ม transaction เพื่อให้การอัปเดตสมบูรณ์ทั้งหมด
  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error("Error starting transaction:", transactionErr);
      return res.status(500).json({ error: "Failed to start transaction" });
    }

    // 1. อัปเดตข้อมูลใน equipment_borrowing
    const updateBorrowingQuery = `
      UPDATE equipment_borrowing 
      SET tech_id = ?, borrow_date = ?, return_date = ?
      WHERE borrowing_id = ?
    `;
    db.query(updateBorrowingQuery, [tech_id, borrow_date, return_date, borrowingId], (updateErr, updateResult) => {
      if (updateErr) {
        return db.rollback(() => {
          console.error("Error updating equipment borrowing:", updateErr);
          res.status(500).json({ error: "Failed to update equipment borrowing", details: updateErr.message });
        });
      }

      if (updateResult.affectedRows === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: "Borrowing record not found" });
        });
      }

      // 2. ดึง task_id จาก borrowing_id เพื่อใช้ในตาราง tasks
      const getTaskIdQuery = `
        SELECT task_id FROM equipment_borrowing WHERE borrowing_id = ?
      `;
      db.query(getTaskIdQuery, [borrowingId], (taskErr, taskResult) => {
        if (taskErr || taskResult.length === 0) {
          return db.rollback(() => {
            console.error("Error fetching task_id:", taskErr);
            res.status(500).json({ error: "Failed to fetch task_id" });
          });
        }

        const taskId = taskResult[0].task_id;

        // 3. อัปเดต user_id ในตาราง tasks
        const updateTaskQuery = `
          UPDATE tasks 
          SET user_id = ?
          WHERE task_id = ?
        `;
        db.query(updateTaskQuery, [tech_id, taskId], (taskUpdateErr, taskUpdateResult) => {
          if (taskUpdateErr) {
            return db.rollback(() => {
              console.error("Error updating tasks:", taskUpdateErr);
              res.status(500).json({ error: "Failed to update tasks", details: taskUpdateErr.message });
            });
          }

          // 4. ลบข้อมูลเก่าจาก borrowing_details
          const deleteDetailsQuery = `
            DELETE FROM borrowing_details 
            WHERE borrowing_id = ?
          `;
          db.query(deleteDetailsQuery, [borrowingId], (deleteErr) => {
            if (deleteErr) {
              return db.rollback(() => {
                console.error("Error deleting borrowing details:", deleteErr);
                res.status(500).json({ error: "Failed to delete borrowing details", details: deleteErr.message });
              });
            }

            // 5. เพิ่มข้อมูลใหม่ใน borrowing_details
            const insertDetailsQuery = `
              INSERT INTO borrowing_details (borrowing_id, product_id, quantity) 
              VALUES ?
            `;
            const values = products.map((product) => [borrowingId, product.product_id, product.quantity]);
            db.query(insertDetailsQuery, [values], (insertErr) => {
              if (insertErr) {
                return db.rollback(() => {
                  console.error("Error inserting borrowing details:", insertErr);
                  res.status(500).json({ error: "Failed to insert borrowing details", details: insertErr.message });
                });
              }

              // Commit transaction ถ้าทุกอย่างสำเร็จ
              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    console.error("Error committing transaction:", commitErr);
                    res.status(500).json({ error: "Failed to commit transaction" });
                  });
                }
                res.json({ message: "Equipment borrowing updated successfully" });
              });
            });
          });
        });
      });
    });
  });
});
router.get('/user-borrowing-counts/:user_id?', (req, res) => {
  const { user_id } = req.params;

  let query = `
    SELECT tech_id, COUNT(*) AS borrow_count
    FROM equipment_borrowing
  `;

  const params = [];

  if (user_id) {
    query += ` WHERE tech_id = ?`;
    params.push(user_id);
  }

  query += ` GROUP BY tech_id`;

  db.query(query, params, (error, results) => {
    if (error) {
      console.error('Error fetching borrowing counts:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No borrowing records found.' });
    }

    res.json(user_id ? results[0] : results);
  });
});

router.put(
  "/v2/equipment-borrowing/update-image/:taskId",
  upload.single("id_card_image"),
  async (req, res) => {
    const { taskId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    try {
      // Upload the new image to Cloudinary
      const idCardImage = req.file.path;
      const result = await cloudinary.uploader.upload(idCardImage, {
        folder: "image/borrowed-equipment",
      });
      const newImageUrl = result.secure_url;

      // Update the image_url in the equipment_borrowing table
      const updateImageQuery = `
        UPDATE equipment_borrowing 
        SET image_url = ?
        WHERE task_id = ?
      `;
      db.query(updateImageQuery, [newImageUrl, taskId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating image URL:", updateErr);
          return res.status(500).json({ error: "Failed to update image URL", details: updateErr.message });
        }

        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ error: "Borrowing record not found for this task ID" });
        }

        // Optionally, delete the old file from local storage (if not using Cloudinary deletion)
        fs.unlink(idCardImage, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });

        res.status(200).json({ message: "ID card image updated successfully", image_url: newImageUrl });
      });
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      res.status(500).json({ error: "Failed to upload image", details: error.message });
    }
  }
);
module.exports = router;
