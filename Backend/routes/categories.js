const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/categories", (req, res) => {
  const query = "SELECT * FROM categories";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching categories: " + err);
      res.status(500).json({ error: "Failed to fetch categories" });
    } else {
      res.json(result);
    }
  });
});

router.get("/categories-paging", (req, res) => {
  const page = parseInt(req.query.page) || 1; // หน้าที่ต้องการ (เริ่มต้นที่หน้า 1)
  const limit = parseInt(req.query.limit) || 10; // จำนวนแถวที่แสดงในแต่ละหน้า (เริ่มต้นที่ 10)

  // คำนวณ offset
  const offset = (page - 1) * limit;

  // คำสั่ง SQL สำหรับดึงข้อมูลในแต่ละหน้า
  const query = `
    SELECT * FROM categories
    LIMIT ? OFFSET ?`;

  // คิวรีข้อมูล
  db.query(query, [limit, offset], (err, result) => {
    if (err) {
      console.error("Error fetching categories: " + err);
      res.status(500).json({ error: "Failed to fetch categories" });
    } else {
      // คิวรีเพื่อหาจำนวนข้อมูลทั้งหมดในตาราง
      const countQuery = "SELECT COUNT(*) AS total FROM categories";
      db.query(countQuery, (err, countResult) => {
        if (err) {
          console.error("Error counting categories: " + err);
          res.status(500).json({ error: "Failed to count categories" });
        } else {
          const total = countResult[0].total; // จำนวนข้อมูลทั้งหมด
          const totalPages = Math.ceil(total / limit); // คำนวณจำนวนหน้าทั้งหมด

          // ส่งข้อมูลและข้อมูลการ pagination
          res.json({
            data: result,
            total,
            totalPages,
            currentPage: page,
            perPage: limit
          });
        }
      });
    }
  });
});

router.get("/category/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM categories WHERE category_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching category: " + err);
      res.status(500).json({ error: "Failed to fetch category" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.json(result[0]);
    }
  });
});

router.post("/categories", (req, res) => {
  const { name, description } = req.body;
  const query = "INSERT INTO categories (name, description) VALUES (?, ?)";

  db.query(query, [name, description], (err, result) => {
    if (err) {
      console.error("Error creating category: " + err);
      res.status(500).json({ error: "Failed to create category" });
    } else {
      res.status(201).json({ category_id: result.insertId, name, description });
    }
  });
});

router.put("/category/:id", (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const query = "UPDATE categories SET name = ?, description = ? WHERE category_id = ?";

  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      console.error("Error updating category: " + err);
      res.status(500).json({ error: "Failed to update category" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.json({ category_id: id, name, description });
    }
  });
});

router.delete("/category/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM categories WHERE category_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting category: " + err);
      res.status(500).json({ error: "Failed to delete category" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(204).send(); 
    }
  });
});

module.exports = router;
