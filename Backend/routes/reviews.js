const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/reviews", (req, res) => {
  const query = "SELECT * FROM reviews";

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
  const id = req.params.id;
  const query = "SELECT * FROM reviews WHERE review_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching review: " + err);
      res.status(500).json({ error: "Failed to fetch review" });
    } else {
      res.json(result[0]); 
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

router.put("/review/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  const { task_id, tech_id, user_id, rating, comment } = req.body;
  const query = "UPDATE reviews SET task_id = ?, tech_id = ?, user_id = ?, rating = ?, comment = ? WHERE review_id = ?";

  db.query(query, [task_id, tech_id, user_id, rating, comment, id], (err, result) => {
    if (err) {
      console.error("Error updating review: " + err);
      res.status(500).json({ error: "Failed to update review" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Review not found" });
    } else {
      res.json({ message: "Review updated successfully" });
    }
  });
});

router.delete("/review/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM reviews WHERE review_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting review: " + err);
      res.status(500).json({ error: "Failed to delete review" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Review not found" });
    } else {
      res.json({ message: "Review deleted successfully" });
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
      res.json(result[0]); 
    }
  });
});

module.exports = router;
