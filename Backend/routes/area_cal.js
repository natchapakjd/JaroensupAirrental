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

router.get("/area_cal-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // ค่าเริ่มต้นเป็นหน้า 1 และ 10 รายการต่อหน้า
  const offset = (page - 1) * limit;

  const query = `
    SELECT * 
    FROM area_calculation_history
    LIMIT ? OFFSET ?
  `;

  const countQuery = "SELECT COUNT(*) AS total FROM area_calculation_history";

  // ดึงข้อมูลแบบแบ่งหน้า
  db.query(query, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
    if (err) {
      console.error("Error fetching paginated area calculations: " + err);
      return res.status(500).json({ error: "Failed to fetch area calculations" });
    }

    // ดึงจำนวนรายการทั้งหมด
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
          currentPage: parseInt(page),
          pageSize: parseInt(limit),
        },
      });
    });
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
  const { 
    assignment_id, 
    location_name, 
    width, 
    height, 
    air_conditioners_needed, 
    area_type,
    air_5ton_used, 
    air_10ton_used, 
    air_20ton_used,
    grid_pattern  // เพิ่มฟิลด์สำหรับเก็บข้อมูล AC Placements
  } = req.body;

  const query = `
    INSERT INTO area_calculation_history 
    (assignment_id, location_name, width, height, air_conditioners_needed, area_type, air_5ton_used, air_10ton_used, air_20ton_used, grid_pattern) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    assignment_id, 
    location_name, 
    width, 
    height, 
    air_conditioners_needed, 
    area_type, 
    air_5ton_used, 
    air_10ton_used, 
    air_20ton_used, 
    JSON.stringify(grid_pattern) // แปลงเป็น JSON String ก่อนบันทึก
  ], (err, result) => {
    if (err) {
      console.error("Error creating area_calculation_history: " + err);
      res.status(500).json({ error: "Failed to create area_calculation_history" });
    } else {
      res.status(201).json({ message: "Area calculation created successfully", id: result.insertId });
    }
  });
});

// Get area calculations by Assignment ID
router.get("/area_cal/assignment/:assignment_id", (req, res) => {
  const { assignment_id } = req.params;

  const query = `
    SELECT * FROM area_calculation_history 
    WHERE assignment_id = ?
  `;

  db.query(query, [assignment_id], (err, result) => {
    if (err) {
      console.error("Error fetching area_calculation_history by assignment_id: " + err);
      res.status(500).json({ error: "Failed to fetch area_calculation_history" });
    } else {
      res.json(result);
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
router.delete("/area_cal/:id", (req, res) => {
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
