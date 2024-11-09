const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/reviews", (req, res) => {
  const query = `
  SELECT 
    rv.*, 
    u.firstname AS member_firstname, 
    u.lastname AS member_lastname, 
    t.tech_id, 
    u2.firstname AS tech_firstname, 
    u2.lastname AS tech_lastname
  FROM 
    reviews rv
  JOIN 
    users u ON rv.user_id = u.user_id  -- Join to get the reviewer's name
  JOIN 
    technicians t ON rv.tech_id = t.tech_id  -- Join to get the technician's tech_id
  JOIN 
    users u2 ON t.user_id = u2.user_id 
`;
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
  const query = `
  SELECT 
    rv.*, 
    u.firstname AS member_firstname, 
    u.lastname AS member_lastname, 
    t.tech_id, 
    u2.firstname AS tech_firstname, 
    u2.lastname AS tech_lastname
  FROM 
    reviews rv
  JOIN 
    users u ON rv.user_id = u.user_id  -- Join to get the reviewer's name
  JOIN 
    technicians t ON rv.tech_id = t.tech_id  -- Join to get the technician's tech_id
  JOIN 
    users u2 ON t.user_id = u2.user_id 
  WHERE rv.review_id  = ?
`;

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
