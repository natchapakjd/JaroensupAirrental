const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/warehouses", (req, res) => {
  const query = "SELECT * FROM warehouses";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching warehouses: " + err);
      res.status(500).json({ error: "Failed to fetch warehouses" });
    } else {
      res.json(result);
    }
  });
});

router.get("/warehouses-paging", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit; // คำนวณ offset ตามหน้าที่ต้องการ

  // คำสั่ง SQL เพื่อดึงข้อมูลที่มีการแบ่งหน้า
  const query = `SELECT * FROM warehouses LIMIT ? OFFSET ?`;

  db.query(query, [limit, offset], (err, result) => {
    if (err) {
      console.error("Error fetching warehouses: " + err);
      res.status(500).json({ error: "Failed to fetch warehouses" });
    } else {
      // คำสั่ง SQL ที่คำนวณจำนวนแถวทั้งหมดในตาราง warehouses
      const countQuery = "SELECT COUNT(*) AS total FROM warehouses";
      
      db.query(countQuery, (err, countResult) => {
        if (err) {
          console.error("Error fetching total count: " + err);
          res.status(500).json({ error: "Failed to fetch total count" });
        } else {
          const total = countResult[0].total;
          const totalPages = Math.ceil(total / limit); // คำนวณจำนวนหน้าทั้งหมด

          res.json({
            data: result,
            totalPages: totalPages,
            currentPage: page,
          });
        }
      });
    }
  });
});


router.get("/warehouse/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM warehouses WHERE warehouse_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching warehouse: " + err);
      res.status(500).json({ error: "Failed to fetch warehouse" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Warehouse not found" });
    } else {
      res.json(result[0]);
    }
  });
});

router.post("/warehouses", (req, res) => {
  const {location, capacity, air_5_ton = 0, air_10_ton = 0, air_20_ton = 0 } = req.body;

  const query = `
    INSERT INTO warehouses (location, capacity, air_5_ton, air_10_ton, air_20_ton) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [location, capacity, air_5_ton, air_10_ton, air_20_ton], (err, result) => {
    if (err) {
      console.error("Error creating warehouse:", err);
      return res.status(500).json({ error: "Failed to create warehouse" });
    }
    
    res.status(201).json({ 
      warehouse_id: result.insertId, 
      location, 
      capacity, 
      air_5_ton, 
      air_10_ton, 
      air_20_ton 
    });
  });
});

router.put("/warehouse/:id", (req, res) => {
  const id = req.params.id;
  const { location, air_5_ton, air_10_ton, air_20_ton} = req.body;

  // คำนวณ capacity ใหม่ (รวมทุกแอร์)
  const newCapacity = (air_5_ton || 0) + (air_10_ton || 0) + (air_20_ton || 0);

  const query = `
    UPDATE warehouses 
    SET location = ?, air_5_ton = ?, air_10_ton = ?, air_20_ton = ?, capacity = ? 
    WHERE warehouse_id = ?
  `;

  db.query(query, [location, air_5_ton, air_10_ton, air_20_ton, newCapacity, id], (err, result) => {
    if (err) {
      console.error("Error updating warehouse:", err);
      return res.status(500).json({ error: "Failed to update warehouse" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.json({ warehouse_id: id, location, air_5_ton, air_10_ton, air_20_ton, capacity: newCapacity });
  });
});


router.delete("/warehouse/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM warehouses WHERE warehouse_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting warehouse: " + err);
      res.status(500).json({ error: "Failed to delete warehouse" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Warehouse not found" });
    } else {
      res.status(204).send(); 
    }
  });
});

module.exports = router;
