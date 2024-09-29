const express = require('express');
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

// Get all borrowing records
router.get("/borrow_product", (req, res) => {
  const query = "SELECT * FROM equipment_borrowing";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching equipment borrowing: " + err);
      res.status(500).json({ error: "Failed to fetch equipment borrowing" });
    } else {
      res.json(result);
    }
  });
});

// Get a single borrowing record by ID
router.get("/borrow_product/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM equipment_borrowing WHERE borrowing_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching equipment borrowing: " + err);
      res.status(500).json({ error: "Failed to fetch equipment borrowing" });
    } else {
      res.json(result[0]);
    }
  });
});

router.post("/borrow_product", (req, res) => {
  const { tech_id, product_id, borrow_date, return_date, status_id, quantity } = req.body;
  const query = "INSERT INTO equipment_borrowing (tech_id, product_id, borrow_date, return_date, status_id, quantity) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(query, [tech_id, product_id, borrow_date, return_date, status_id, quantity], (err, result) => {
    if (err) {
      console.error("Error creating borrowing record: " + err);
      res.status(500).json({ error: "Failed to create borrowing record" });
    } else {
      res.status(201).json({ message: "Borrowing record created", id: result.insertId });
    }
  });
});

router.put("/borrow_product/:id", (req, res) => {
  const id = req.params.id;
  const { tech_id, product_id, borrow_date, return_date, status_id, quantity } = req.body;
  const query = "UPDATE equipment_borrowing SET tech_id = ?, product_id = ?, borrow_date = ?, return_date = ?, status_id = ?, quantity = ? WHERE borrowing_id = ?";

  db.query(query, [tech_id, product_id, borrow_date, return_date, status_id, quantity, id], (err, result) => {
    if (err) {
      console.error("Error updating borrowing record: " + err);
      res.status(500).json({ error: "Failed to update borrowing record" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Borrowing record not found" });
    } else {
      res.json({ message: "Borrowing record updated" });
    }
  });
});

router.delete("/borrow_product/:id",isAdmin,(req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM equipment_borrowing WHERE borrowing_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting borrowing record: " + err);
      res.status(500).json({ error: "Failed to delete borrowing record" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Borrowing record not found" });
    } else {
      res.json({ message: "Borrowing record deleted" });
    }
  });
});

module.exports = router;
