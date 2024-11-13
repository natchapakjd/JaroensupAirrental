const express = require("express");
const router = express.Router();
const db = require("../db"); // เชื่อมต่อฐานข้อมูล MySQL

// GET /shippings - ดึงข้อมูลทั้งหมดจากตาราง shipping
router.get("/shippings", (req, res) => {
  const query = "SELECT * FROM shipping";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching shipping methods: " + err);
      res.status(500).json({ error: "Failed to fetch shipping methods" });
    } else {
      res.json(result);
    }
  });
});

// GET /shipping/:id - ดึงข้อมูลการจัดส่งจาก id
router.get("/shipping/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM shipping WHERE shipping_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching shipping method: " + err);
      res.status(500).json({ error: "Failed to fetch shipping method" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Shipping method not found" });
    } else {
      res.json(result[0]);
    }
  });
});

// PUT /shipping/:id - อัปเดตข้อมูลการจัดส่ง
router.put("/shipping/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    UPDATE shipping
    SET name = ?, description = ?, price = ?
    WHERE shipping_id = ?
  `;

  db.query(query, [name, description, price, id], (err, result) => {
    if (err) {
      console.error("Error updating shipping method: " + err);
      res.status(500).json({ error: "Failed to update shipping method" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Shipping method not found" });
    } else {
      res.json({ message: "Shipping method updated successfully" });
    }
  });
});

// DELETE /shipping/:id - ลบข้อมูลการจัดส่ง
router.delete("/shipping/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM shipping WHERE shipping_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting shipping method: " + err);
      res.status(500).json({ error: "Failed to delete shipping method" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Shipping method not found" });
    } else {
      res.json({ message: "Shipping method deleted successfully" });
    }
  });
});

// POST /shipping - เพิ่มข้อมูลการจัดส่งใหม่
router.post("/shipping", (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO shipping (name, description, price)
    VALUES (?, ?, ?)
  `;

  db.query(query, [name, description, price], (err, result) => {
    if (err) {
      console.error("Error creating shipping method: " + err);
      res.status(500).json({ error: "Failed to create shipping method" });
    } else {
      res.status(201).json({ message: "Shipping method created successfully", shippingId: result.insertId });
    }
  });
});

module.exports = router;
