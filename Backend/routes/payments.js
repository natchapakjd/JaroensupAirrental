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
// Create a new payment

router.post("/payments", upload.single('slip_images'), async (req, res) => {
  const { amount, user_id, method_id, payment_date, order_id, task_id, status_id } = req.body;
  let slipImagePath = null;
  console.log(req.body)

  try {
    // Upload the image to Cloudinary if a file is provided
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      slipImagePath = uploadResult.secure_url; // Get the secure URL of the uploaded image
    }

    let query;
    const values = [
      amount,
      user_id,
      method_id,
      payment_date,
      slipImagePath,
      status_id
    ];
    if (task_id == 'null') {
      query = `
        INSERT INTO payments (amount, user_id, order_id, method_id, payment_date, image_url, status_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      values.splice(2, 0, order_id); // Insert task_id into the correct position
    } else if (order_id == 'null') {
      query = `
        INSERT INTO payments (amount, user_id, task_id, method_id, payment_date, image_url, status_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
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
  console.log(req.body)

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
      payment_date,
      slipImagePath,
      status_id,
      id
    ];

    if (task_id === '') {
      query = `
        UPDATE payments 
        SET amount = ?, user_id = ?, order_id = ?, method_id = ?, payment_date = ?, image_url = ?, status_id = ? 
        WHERE payment_id = ?`;
      values.splice(2, 0, order_id); // Insert order_id into the correct position
    } else if (order_id === '') {
      query = `
        UPDATE payments 
        SET amount = ?, user_id = ?, task_id = ?, method_id = ?, payment_date = ?, image_url = ?, status_id = ? 
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
  const query = "SELECT SUM(amount) AS total_amount FROM payments";

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
  console.log(req.body)
  console.log(slipImagePath)

  try {
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      slipImagePath = uploadResult.secure_url;  
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

module.exports = router;
