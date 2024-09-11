const express = require("express");
const router = express.Router();
const db = require('../db');


router.get("/service_areas", (req, res) => {
    const query = "SELECT * FROM  service_areas ";
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching service_areas: " + err);
        res.status(500).json({ error: "Failed to fetch service_areas" });
      } else {
        res.json(result);
      }
    });
  });
  
  router.get("/service_area/:id", (req, res) => {
    const id = req.params.id
    const query = "SELECT *FROM service_areas WHERE  service_area_id = ?";
  
    db.query(query,[id] ,(err, result) => {
      if (err) {
        console.error("Error fetching service_area " + err);
        res.status(500).json({ error: "Failed to fetch service_area" });
      } else {
        res.json(result);
      }
    });
  });
  
  
  
  module.exports = router;