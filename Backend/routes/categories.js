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
