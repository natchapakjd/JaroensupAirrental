const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/payments", (req, res) => {
  const query = "SELECT * FROM  payments ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching payments: " + err);
      res.status(500).json({ error: "Failed to fetch payments" });
    } else {
      res.json(result);
    }
  });
});

router.get("/payment/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM payments WHERE  payment_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching payments " + err);
      res.status(500).json({ error: "Failed to fetch payments" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;