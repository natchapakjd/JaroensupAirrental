const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/brands", (req, res) => {
  const query = "SELECT * FROM  brands ";

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
  const id = req.params.id
  const query = "SELECT *FROM brands WHERE  brand_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching brand " + err);
      res.status(500).json({ error: "Failed to fetch brand" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;