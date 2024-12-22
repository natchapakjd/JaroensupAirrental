const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/brands", (req, res) => {
  const query = "SELECT * FROM brands";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching brands: " + err);
      res.status(500).json({ error: "Failed to fetch brands" });
    } else {
      res.json(result);
    }
  });
});
router.get("/brands-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 items per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT * 
    FROM brands
    LIMIT ? OFFSET ?
  `;

  const countQuery = "SELECT COUNT(*) AS total FROM brands";

  // Fetch the paginated data
  db.query(query, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
    if (err) {
      console.error("Error fetching paginated brands data: " + err);
      return res.status(500).json({ error: "Failed to fetch brands" });
    }

    // Fetch the total count for pagination info
    db.query(countQuery, (err, countResult) => {
      if (err) {
        console.error("Error fetching total count: " + err);
        return res.status(500).json({ error: "Failed to fetch total count" });
      }

      const totalCount = countResult[0].total;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        data: dataResult,
        total: {
          totalItems: totalCount,
          totalPages: totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    });
  });
});


router.get("/brand/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM brands WHERE brand_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching brand: " + err);
      res.status(500).json({ error: "Failed to fetch brand" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Brand not found" });
    } else {
      res.json(result[0]);
    }
  });
});

router.post("/brands", (req, res) => {
  const { name, description } = req.body;
  const query = "INSERT INTO brands (name, description) VALUES (?, ?)";

  db.query(query, [name, description], (err, result) => {
    if (err) {
      console.error("Error creating brand: " + err);
      res.status(500).json({ error: "Failed to create brand" });
    } else {
      res.status(201).json({ brand_id: result.insertId, name, description });
    }
  });
});

router.put("/brand/:id", (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const query = "UPDATE brands SET name = ?, description = ? WHERE brand_id = ?";

  db.query(query, [name, description, id], (err, result) => {
    if (err) {
      console.error("Error updating brand: " + err);
      res.status(500).json({ error: "Failed to update brand" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Brand not found" });
    } else {
      res.json({ brand_id: id, name, description });
    }
  });
});

router.delete("/brand/:id",(req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM brands WHERE brand_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting brand: " + err);
      res.status(500).json({ error: "Failed to delete brand" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Brand not found" });
    } else {
      res.status(204).send(); 
    }
  });
});

module.exports = router;
