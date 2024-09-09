const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/categories", (req, res) => {
  const query = "SELECT * FROM  categories ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching categories: " + err);
      res.status(500).json({ error: "Failed to fetch categorie" });
    } else {
      res.json(result);
    }
  });
});

router.get("/category/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM categories WHERE  id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching category " + err);
      res.status(500).json({ error: "Failed to fetch category" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;