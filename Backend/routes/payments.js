const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const sharp = require('sharp');
const cloudinary = require("../cloundinary-config");
const isAdmin = require('../middlewares/isAdmin');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/payment-image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/payments", (req, res) => {
  const query = "SELECT pm.*,t.description as task_desc, u.firstname, u.lastname, pmt.method_name, st.status_name FROM payments pm JOIN users u ON pm.user_id = u.user_id JOIN tasks t ON pm.task_id = t.task_id JOIN payment_methods pmt ON pm.method_id = pmt.method_id JOIN status st ON pm.status_id = st.status_id";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching payments: " + err);
      res.status(500).json({ error: "Failed to fetch payments" });
    } else {
      res.json(result);
    }
  });
});

router.get("/payments-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // ค่าเริ่มต้นเป็นหน้า 1 และ 10 รายการต่อหน้า
  const offset = (page - 1) * limit;

  const query = `
    SELECT pm.*, t.description as task_desc, u.firstname, u.lastname, 
           pmt.method_name, st.status_name 
    FROM payments pm 
    JOIN users u ON pm.user_id = u.user_id 
    JOIN tasks t ON pm.task_id = t.task_id 
    JOIN payment_methods pmt ON pm.method_id = pmt.method_id 
    JOIN status st ON pm.status_id = st.status_id 
    LIMIT ? OFFSET ?
  `;

  const countQuery = "SELECT COUNT(*) AS total FROM payments";

  // ดึงข้อมูลตามหน้าและจำนวนที่กำหนด
  db.query(query, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
    if (err) {
      console.error("Error fetching paginated payments data: " + err);
      return res.status(500).json({ error: "Failed to fetch payments" });
    }

    // ดึงจำนวนทั้งหมดของข้อมูล
    db.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error fetching total count: " + err);
        return res.status(500).json({ error: "Failed to fetch total count" });
      }

      const totalCount = countResult[0].total;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        data: dataResult,
        total: {
          totalItems: totalCount,
          totalPages: totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    });
  });
});

router.get("/payments/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM payments WHERE user_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching payment: " + err);
      res.status(500).json({ error: "Failed to fetch payment" });
    } else {
      res.json(result);
    }
  });
});

  router.get("/payment-task/:id", (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM payments WHERE task_id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error fetching payment: " + err);
        res.status(500).json({ error: "Failed to fetch payment" });
      } else {
        res.json(result);
      }
    });
  });

  router.get("/payment-payment/:id", (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM payments WHERE payment_id = ?";

    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error fetching payment: " + err);
        res.status(500).json({ error: "Failed to fetch payment" });
      } else {
        res.json(result);
      }
    });
  });


router.post("/payments", upload.single('slip_images'), async (req, res) => {
  const { amount, user_id, method_id, payment_date, order_id, task_id, status_id } = req.body;
  let slipImagePath = null;
  console.log(req.body)
  try {
    if (req.file) {
      const slipImage = req.file.path;
      const result = await cloudinary.uploader.upload(slipImage, {
        folder: "image/payment-image",
      });
      slipImagePath = result.secure_url;
    }

    let query;
    const values = [
      amount,
      user_id,
      method_id,
      slipImagePath,
      status_id
    ];
    if (task_id == 'null') {
      query = `
        INSERT INTO payments (amount, user_id, order_id, method_id, image_url, status_id)
        VALUES (?, ?, ?, ?, ?, ?)`;
      values.splice(2, 0, order_id); // Insert task_id into the correct position
    } else if (order_id == 'null') {
      query = `
        INSERT INTO payments (amount, user_id, task_id, method_id, image_url, status_id)
        VALUES (?, ?, ?, ?, ?, ?)`;
      values.splice(2, 0, task_id); // Insert order_id into the correct position

    } else {
      return res.status(400).json({ error: "Either task_id or order_id must be provided." });
    }

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error creating payment: " + err);
        return res.status(500).json({ error: "Failed to create payment" });
      }
      res.status(201).json({ payment_id: result.insertId });
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary: " + error);
    res.status(500).json({ error: "Failed to upload image to Cloudinary" });
  }
});

// Update a payment
router.put("/payments/:id", upload.single('slip_images'), async (req, res) => {
  const id = req.params.id;
  const { amount, user_id, method_id, payment_date, order_id, task_id, status_id } = req.body;
  try {
    let slipImagePath = null;

    // Upload the image to Cloudinary if a file is provided
    if (req.file) {
      const slipImage = req.file.path;
      const result = await cloudinary.uploader.upload(slipImage, {
        folder: "image/payment-image",
      });
      slipImagePath = result.secure_url; // Get the secure URL of the uploaded image
    }

    let query;
    const values = [
      amount,
      user_id,
      method_id,
      slipImagePath,
      status_id,
      id
    ];

    if (task_id === '') {
      query = `
        UPDATE payments 
        SET amount = ?, user_id = ?, order_id = ?, method_id = ?, image_url = ?, status_id = ? 
        WHERE payment_id = ?`;
      values.splice(2, 0, order_id); // Insert order_id into the correct position
    } else if (order_id === '') {
      query = `
        UPDATE payments 
        SET amount = ?, user_id = ?, task_id = ?, method_id = ?, image_url = ?, status_id = ? 
        WHERE payment_id = ?`;
      values.splice(2, 0, task_id); // Insert task_id into the correct position
    } else {
      return res.status(400).json({ error: "Either task_id or order_id must be provided." });
    }

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error updating payment: " + err);
        return res.status(500).json({ error: "Failed to update payment" });
      }

      res.json({ message: "Payment updated successfully" });
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary: " + error);
    res.status(500).json({ error: "Failed to upload image to Cloudinary" });
  }
});

// Delete a payment
router.delete("/payment/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM payments WHERE payment_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting payment: " + err);
      res.status(500).json({ error: "Failed to delete payment" });
    } else {
      res.json({ message: "Payment deleted successfully" });
    }
  });
});

router.get("/payments-sum/total", (req, res) => {
  const query = `
    SELECT 
      SUM(p.amount + t.total) AS total_amount 
    FROM payments p
    INNER JOIN tasks t ON p.task_id = t.task_id
    WHERE p.status_id = 2 AND t.status_id = 2
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching total amount: ", err);
      return res.status(500).json({ error: "Failed to fetch total amount" });
    }
    res.status(200).json(result[0]);
  });
});

router.get('/payment-methods', (req, res) => {
  const query = 'SELECT * FROM payment_methods';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching payment methods: ' + err);
      return res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
    res.json(results);
  });
});

router.put("/payments/:paymentId/slip_image", upload.single('slip_image'), async (req, res) => {
  const paymentId = req.params.paymentId;
  let slipImagePath = null;

  try {
    if (req.file) {
      const slipImage = req.file.path;
      const result = await cloudinary.uploader.upload(slipImage, {
        folder: "image/payment-image",
      });
      slipImagePath = result.secure_url;
    }

    if (!slipImagePath) {
      return res.status(400).json({ error: "No image uploaded." });
    }

    const query = `
      UPDATE payments 
      SET image_url = ? 
      WHERE task_id = ?
    `;
    
    db.query(query, [slipImagePath, paymentId], (err, result) => {
      if (err) {
        console.error("Error updating payment slip image: " + err);
        return res.status(500).json({ error: "Failed to update payment slip image." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Payment not found." });
      }

      res.status(200).json({ message: "Payment slip image updated successfully." });
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary: " + error);
    res.status(500).json({ error: "Failed to upload image to Cloudinary" });
  }
});

router.put("/payments/:id/status", (req, res) => {
  const paymentId = req.params.id;
  const { status_id } = req.body;

  if (!status_id) {
    return res.status(400).json({ error: "status_id is required" });
  }

  const query = `
    UPDATE payments
    SET status_id = ?
    WHERE payment_id = ?
  `;

  db.query(query, [status_id, paymentId], (err, result) => {
    if (err) {
      console.error("Error updating payment status: " + err);
      return res.status(500).json({ error: "Failed to update payment status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({ message: "Payment status updated successfully" });
  });
});

module.exports = router;
