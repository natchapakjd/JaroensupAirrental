const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/products", (req, res) => {
  const query = "SELECT * FROM  products ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching products: " + err);
      res.status(500).json({ error: "Failed to fetch product" });
    } else {
      res.json(result);
    }
  });
});

router.get("/product/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM products WHERE  product_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching product " + err);
      res.status(500).json({ error: "Failed to fetch product" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;