const express = require('express')
const router = express.Router();
const db = require("../db");

router.get("/borrow_product", (req, res) => {
    const query = "SELECT * FROM  equipment_borrowing ";
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching equipment_borrowing: " + err);
        res.status(500).json({ error: "Failed to fetch equipment_borrowing" });
      } else {
        res.json(result[0]);
      }
    });
  });
  
  router.get("/borrow_product/:id", (req, res) => {
    const id = req.params.id
    const query = "SELECT *FROM equipment_borrowing WHERE  borrowing_id = ?";
  
    db.query(query,[id] ,(err, result) => {
      if (err) {
        console.error("Error fetching equipment_borrowing " + err);
        res.status(500).json({ error: "Failed to fetch equipment_borrowing" });
      } else {
        res.json(result[0]);
      }
    });
  });
  
  
  
  module.exports = router;