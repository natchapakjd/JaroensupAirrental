const express = require('express');
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

// Get all area calculations
router.get("/area_cals", (req, res) => {
    const query = "SELECT * FROM area_calculation_history";
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching area_calculation_historys: " + err);
        res.status(500).json({ error: "Failed to fetch area_calculation_historys" });
      } else {
        res.json(result);
      }
    });
});

// Get area calculation by ID
router.get("/area_cal/:id", (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM area_calculation_history WHERE calculation_id = ?";
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error fetching area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to fetch area_calculation_history" });
      } else {
        res.json(result);
      }
    });
});

// Create new area calculation
router.post("/area_cal", (req, res) => {
    const { assignment_id, location_name, width, height, air_conditioners_needed, area_type } = req.body;
    const query = `
        INSERT INTO area_calculation_history 
        (assignment_id, location_name, width, height, air_conditioners_needed, area_type) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [assignment_id, location_name, width, height, air_conditioners_needed, area_type], (err, result) => {
      if (err) {
        console.error("Error creating area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to create area_calculation_history" });
      } else {
        res.status(201).json({ message: "Area calculation created successfully", id: result.insertId });
      }
    });
});

// Update area calculation by ID
router.put("/area_cal/:id", (req, res) => {
    const id = req.params.id;
    const { assignment_id, location_name, width, height, air_conditioners_needed, area_type } = req.body;
    const query = `
        UPDATE area_calculation_history 
        SET assignment_id = ?, location_name = ?, width = ?, height = ?, air_conditioners_needed = ?, area_type = ? 
        WHERE calculation_id = ?
    `;
  
    db.query(query, [assignment_id, location_name, width, height, air_conditioners_needed, area_type, id], (err, result) => {
      if (err) {
        console.error("Error updating area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to update area_calculation_history" });
      } else {
        res.json({ message: "Area calculation updated successfully" });
      }
    });
});

// Delete area calculation by ID
router.delete("/area_cal/:id", isAdmin, (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM area_calculation_history WHERE calculation_id = ?";
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to delete area_calculation_history" });
      } else {
        res.json({ message: "Area calculation deleted successfully" });
      }
    });
});

module.exports = router;
