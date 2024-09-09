const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/attributes", (req, res) => {
  const query = "SELECT * FROM  attributes ";

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
  const id = req.params.id
  const query = "SELECT *FROM attributes WHERE  attribute_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching attribute " + err);
      res.status(500).json({ error: "Failed to fetch attribute" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;