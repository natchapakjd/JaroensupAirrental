const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/brands", (req, res) => {
  const query = "SELECT * FROM brands";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching brands: " + err);
      res.status(500).json({ error: "Failed to fetch brands" });
    } else {
      res.json(result);
    }
  });
});

router.get("/brand/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM brands WHERE brand_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching brand: " + err);
      res.status(500).json({ error: "Failed to fetch brand" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Brand not found" });
    } else {
      res.json(result[0]);
    }
  });
});

router.post("/brands", (req, res) => {
  const { name, description } = req.body;
  const query = "INSERT INTO brands (name, description) VALUES (?, ?)";

  db.query(query, [name, description], (err, result) => {
    if (err) {
      console.error("Error creating brand: " + err);
      res.status(500).json({ error: "Failed to create brand" });
    } else {
      res.status(201).json({ brand_id: result.insertId, name, description });
    }
  });
});

router.put("/brand/:id", (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const query = "UPDATE brands SET name = ?, description = ? WHERE brand_id = ?";

  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      console.error("Error updating brand: " + err);
      res.status(500).json({ error: "Failed to update brand" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Brand not found" });
    } else {
      res.json({ brand_id: id, name, description });
    }
  });
});

router.delete("/brand/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM brands WHERE brand_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting brand: " + err);
      res.status(500).json({ error: "Failed to delete brand" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Brand not found" });
    } else {
      res.status(204).send(); 
    }
  });
});

module.exports = router;
