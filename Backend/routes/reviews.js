const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/reviews", (req, res) => {
  const query = "SELECT * FROM  reviews ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching reviews: " + err);
      res.status(500).json({ error: "Failed to fetch reviews" });
    } else {
      res.json(result);
    }
  });
});

router.get("/review/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM reviews WHERE  review_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching review " + err);
      res.status(500).json({ error: "Failed to fetch review" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;