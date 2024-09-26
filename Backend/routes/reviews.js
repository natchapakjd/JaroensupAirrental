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

router.post("/review", (req, res) => {
  const { task_id, tech_id, user_id, rating, comment } = req.body;

  const query = "INSERT INTO reviews (task_id, tech_id, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)";
  const values = [task_id, tech_id, user_id, rating, comment];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error adding review: " + err);
      res.status(500).json({ error: "Failed to add review" });
    } else {
      res.status(201).json({ message: "Review added successfully", review_id: result.insertId });
    }
  });
});

router.get("/review/:taskId/:userId", (req, res) => {
  const { taskId, userId } = req.params;
  const query = "SELECT * FROM reviews WHERE task_id = ? AND user_id = ?";

  db.query(query, [taskId, userId], (err, result) => {
    if (err) {
      console.error("Error fetching review: " + err);
      res.status(500).json({ error: "Failed to fetch review" });
    } else {
      res.json(result[0]); // Return the review if found
    }
  });
});

module.exports = router;