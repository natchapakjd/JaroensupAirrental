const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/warehouses", (req, res) => {
  const query = "SELECT * FROM  warehouses ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching warehouses: " + err);
      res.status(500).json({ error: "Failed to fetch warehouses" });
    } else {
      res.json(result);
    }
  });
});

router.get("/warehouse/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM warehouses WHERE  warehouse_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching warehouse " + err);
      res.status(500).json({ error: "Failed to fetch warehouse" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;