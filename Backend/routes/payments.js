const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const sharp = require('sharp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/payment-image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Fetch all payments
router.get("/payments", (req, res) => {
  const query = "SELECT * FROM payments";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching payments: " + err);
      res.status(500).json({ error: "Failed to fetch payments" });
    } else {
      res.json(result);
    }
  });
});

// Fetch a single payment by ID
router.get("/payment/:id", (req, res) => {
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

// Create a new payment

router.post("/payments", upload.single('slip_images'), (req, res) => {
  const { amount, user_id, task_id, payment_method, payment_date, order_id, status } = req.body;
  const slipImagePath = req.file ? req.file.path : null; // Path to the uploaded file
  const query = `
    INSERT INTO payments (amount, user_id, task_id, payment_method, payment_date, slip_images, order_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [amount, user_id, task_id, payment_method, payment_date, slipImagePath, order_id, status], (err, result) => {
    if (err) {
      console.error("Error creating payment: " + err);
      res.status(500).json({ error: "Failed to create payment" });
    } else {
      res.status(201).json({ payment_id: result.insertId });
    }
  });
});

// Update a payment
router.put("/payments/:id", upload.single('slip_images'), (req, res) => {
  const id = req.params.id;
  const { amount, user_id, task_id, payment_method, payment_date, order_id, status } = req.body;
  const slipImagePath = req.file ? req.file.path : null; // Path to the uploaded file

  // Update query to include all fields, including the new slip image if provided
  const query = `
    UPDATE payments 
    SET amount = ?, user_id = ?, task_id = ?, payment_method = ?, payment_date = ?, slip_images = ?, order_id = ?, status = ? 
    WHERE payment_id = ?`;

  db.query(query, [amount, user_id, task_id, payment_method, payment_date, slipImagePath, order_id, status, id], (err, result) => {
    if (err) {
      console.error("Error updating payment: " + err);
      res.status(500).json({ error: "Failed to update payment" });
    } else {
      res.json({ message: "Payment updated successfully" });
    }
  });
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

router.get("/payments/total", (req, res) => {
  const query = "SELECT SUM(amount) AS total_amount FROM payments";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching total amount: " + err);
      return res.status(500).json({ error: "Failed to fetch total amount" });
    }

    const totalAmount = result[0].total_amount || 0; // Default to 0 if no payments
    res.status(200).json({ totalAmount });
  });
});

module.exports = router;
