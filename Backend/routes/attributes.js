const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/attributes", (req, res) => {
  const query = "SELECT * FROM attributes";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching attributes: " + err);
      res.status(500).json({ error: "Failed to fetch attributes" });
    } else {
      res.json(result);
    }
  });
});

router.get("/attribute/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM attributes WHERE attribute_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching attribute: " + err);
      res.status(500).json({ error: "Failed to fetch attribute" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Attribute not found" });
    } else {
      res.json(result[0]); 
    }
  });
});

router.put("/attribute/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body; 

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const query = `
    UPDATE attributes
    SET name = ?
    WHERE attribute_id = ?
  `;

  db.query(query, [name, id], (err, result) => {
    if (err) {
      console.error("Error updating attribute: " + err);
      res.status(500).json({ error: "Failed to update attribute" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Attribute not found" });
    } else {
      res.json({ message: "Attribute updated successfully" });
    }
  });
});


router.delete("/attribute/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM attributes WHERE attribute_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting attribute: " + err);
      res.status(500).json({ error: "Failed to delete attribute" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Attribute not found" });
    } else {
      res.json({ message: "Attribute deleted successfully" });
    }
  });
});

router.post("/attribute", (req, res) => {
  const { name} = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name are required" });
  }

  const query = `
    INSERT INTO attributes (name)
    VALUES (?)
  `;

  db.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error creating attribute: " + err);
      res.status(500).json({ error: "Failed to create attribute" });
    } else {
      res.status(201).json({ message: "Attribute created successfully", attributeId: result.insertId });
    }
  });
});


module.exports = router;
