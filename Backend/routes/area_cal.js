const express = require('express');
const router = express.Router();
const db = require("../db");

// 📌 ดึงข้อมูลทั้งหมดจาก area_calculation_history
router.get("/area_cals", (req, res) => {
    const query = `
      SELECT area_calculation_history.*, room_types.room_name AS room_type_name 
      FROM area_calculation_history
      INNER JOIN room_types ON area_calculation_history.room_type_id = room_types.id
    `;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to fetch area_calculation_history" });
      } else {
        res.json(result);
      }
    });
});

// 📌 ดึงข้อมูลแบบแบ่งหน้า
router.get("/area_cal-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const query = `
    SELECT area_calculation_history.*, room_types.room_name AS room_type_name 
    FROM area_calculation_history
    INNER JOIN room_types ON area_calculation_history.room_type_id = room_types.id
    LIMIT ? OFFSET ?
  `;

  const countQuery = "SELECT COUNT(*) AS total FROM area_calculation_history";

  db.query(query, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
    if (err) {
      console.error("Error fetching paginated area calculations: " + err);
      return res.status(500).json({ error: "Failed to fetch area calculations" });
    }

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

router.get("/area_cal/:id", (req, res) => {
    const id = req.params.id;
    const query = `
      SELECT area_calculation_history.*, room_types.room_name AS room_type_name 
      FROM area_calculation_history
      INNER JOIN room_types ON area_calculation_history.room_type_id = room_types.id
      WHERE calculation_id = ?
    `;
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error fetching area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to fetch area_calculation_history" });
      } else {
        res.json(result);
      }
    });
});

router.post("/area_cal", (req, res) => {
  const { 
    assignment_id, 
    location_name, 
    width, 
    height, 
    air_conditioners_needed, 
    room_type_id,  
    air_5ton_used, 
    air_10ton_used, 
    air_20ton_used,
    grid_pattern 
  } = req.body;

  const query = `
    INSERT INTO area_calculation_history 
    (assignment_id, location_name, width, height, air_conditioners_needed, room_type_id, air_5ton_used, air_10ton_used, air_20ton_used, grid_pattern) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    assignment_id, 
    location_name, 
    width, 
    height, 
    air_conditioners_needed, 
    room_type_id, 
    air_5ton_used, 
    air_10ton_used, 
    air_20ton_used, 
    JSON.stringify(grid_pattern)
  ], (err, result) => {
    if (err) {
      console.error("Error creating area_calculation_history: " + err);
      res.status(500).json({ error: "Failed to create area_calculation_history" });
    } else {
      res.status(201).json({ message: "Area calculation created successfully", id: result.insertId });
    }
  });
});

router.put("/v2/area_cal/:id", (req, res) => {
  const id = req.params.id;
  const {
    assignment_id,
    location_name,
    width,
    height,
    air_conditioners_needed,
    room_type_id,
    air_5ton_used,
    air_10ton_used,
    air_20ton_used,
    grid_pattern,
  } = req.body;

  const query = `
    UPDATE area_calculation_history 
    SET assignment_id = ?, location_name = ?, width = ?, height = ?, air_conditioners_needed = ?, room_type_id = ?, 
        air_5ton_used = ?, air_10ton_used = ?, air_20ton_used = ?, grid_pattern = ? 
    WHERE calculation_id = ?
  `;

  db.query(
    query,
    [
      assignment_id,
      location_name,
      width,
      height,
      air_conditioners_needed,
      room_type_id,
      air_5ton_used,
      air_10ton_used,
      air_20ton_used,
      JSON.stringify(grid_pattern),
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to update area_calculation_history" });
      } else {
        res.json({ message: "Area calculation updated successfully" });
      }
    }
  );
});

// 📌 อัปเดตข้อมูล
router.put("/area_cal/:id", (req, res) => {
    const id = req.params.id;
    const { assignment_id, location_name, width, height, air_conditioners_needed, room_type_id } = req.body;
    const query = `
        UPDATE area_calculation_history 
        SET assignment_id = ?, location_name = ?, width = ?, height = ?, air_conditioners_needed = ?, room_type_id = ? 
        WHERE calculation_id = ?
    `;
  
    db.query(query, [assignment_id, location_name, width, height, air_conditioners_needed, room_type_id, id], (err, result) => {
      if (err) {
        console.error("Error updating area_calculation_history: " + err);
        res.status(500).json({ error: "Failed to update area_calculation_history" });
      } else {
        res.json({ message: "Area calculation updated successfully" });
      }
    });
});

// 📌 ลบข้อมูล
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
