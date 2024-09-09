const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/productAttrs", (req, res) => {
  const query = "SELECT * FROM  productattrbutes ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching productattrbutes: " + err);
      res.status(500).json({ error: "Failed to fetch productattrbutes" });
    } else {
      res.json(result);
    }
  });
});

router.get("/productAttr/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM productattrbutes WHERE  product_attribute_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching productattributes " + err);
      res.status(500).json({ error: "Failed to fetch productattribute" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;