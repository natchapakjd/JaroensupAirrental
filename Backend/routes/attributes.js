const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/attributes", (req, res) => {
  const query = "SELECT * FROM attributes";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching attributes: " + err);
      res.status(500).json({ error: "Failed to fetch attributes" });
    } else {
      res.json(result);
    }
  });
});

router.get("/attributes-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) AS total FROM attributes";
  const query = "SELECT * FROM attributes LIMIT ? OFFSET ?";

  // Get total count for pagination
  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error fetching total attributes count: " + err);
      return res.status(500).json({ error: "Failed to fetch attributes count" });
    }

    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch the paginated attributes
    db.query(query, [parseInt(limit), offset], (err, result) => {
      if (err) {
        console.error("Error fetching attributes: " + err);
        return res.status(500).json({ error: "Failed to fetch attributes" });
      }

      // Return paginated result along with total count and total pages
      res.json({
        data: result,
        total: {
          totalCount,
          totalPages,
          currentPage: parseInt(page),
        },
      });
    });
  });
});
router.get("/attribute/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM attributes WHERE attribute_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching attribute: " + err);
      res.status(500).json({ error: "Failed to fetch attribute" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Attribute not found" });
    } else {
      res.json(result[0]); 
    }
  });
});

router.put("/attribute/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body; 

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const query = `
    UPDATE attributes
    SET name = ?
    WHERE attribute_id = ?
  `;

  db.query(query, [name, id], (err, result) => {
    if (err) {
      console.error("Error updating attribute: " + err);
      res.status(500).json({ error: "Failed to update attribute" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Attribute not found" });
    } else {
      res.json({ message: "Attribute updated successfully" });
    }
  });
});


router.delete("/attribute/:id",(req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM attributes WHERE attribute_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting attribute: " + err);
      res.status(500).json({ error: "Failed to delete attribute" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Attribute not found" });
    } else {
      res.json({ message: "Attribute deleted successfully" });
    }
  });
});

router.post("/attribute", (req, res) => {
  const { name} = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name are required" });
  }

  const query = `
    INSERT INTO attributes (name)
    VALUES (?)
  `;

  db.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error creating attribute: " + err);
      res.status(500).json({ error: "Failed to create attribute" });
    } else {
      res.status(201).json({ message: "Attribute created successfully", attributeId: result.insertId });
    }
  });
});


module.exports = router;
