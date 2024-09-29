const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/productAttrs", (req, res) => {
  const query = "SELECT * FROM productattrbutes";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching product attributes: " + err);
      res.status(500).json({ error: "Failed to fetch product attributes" });
    } else {
      res.json(result);
    }
  });
});

router.get("/productAttr/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM productattrbutes WHERE product_attribute_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching product attribute: " + err);
      res.status(500).json({ error: "Failed to fetch product attribute" });
    } else {
      res.json(result);
    }
  });
});

router.post("/productAttrs", isAdmin, (req, res) => {
  const { attribute_id, product_id, value } = req.body;
  const query = "INSERT INTO productattrbutes (attribute_id, product_id, value) VALUES (?, ?, ?)";

  db.query(query, [attribute_id, product_id, value], (err, result) => {
    if (err) {
      console.error("Error creating product attribute: " + err);
      res.status(500).json({ error: "Failed to create product attribute" });
    } else {
      res.status(201).json({ message: "Product attribute created", id: result.insertId });
    }
  });
});

router.put("/productAttr/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  const { attribute_id, product_id, value } = req.body;
  const query = "UPDATE productattrbutes SET attribute_id = ?, product_id = ?, value = ? WHERE product_attribute_id = ?";

  db.query(query, [attribute_id, product_id, value, id], (err, result) => {
    if (err) {
      console.error("Error updating product attribute: " + err);
      res.status(500).json({ error: "Failed to update product attribute" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product attribute not found" });
    } else {
      res.json({ message: "Product attribute updated" });
    }
  });
});

router.delete("/productAttr/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM productattrbutes WHERE product_attribute_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product attribute: " + err);
      res.status(500).json({ error: "Failed to delete product attribute" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Product attribute not found" });
    } else {
      res.json({ message: "Product attribute deleted" });
    }
  });
});

module.exports = router;
