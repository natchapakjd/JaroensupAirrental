const express = require('express')
const router = express.Router();
const db = require("../db");

router.get("/area_cals", (req, res) => {
    const query = "SELECT * FROM  area_calculation_history ";
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching area_calculation_historys: " + err);
        res.status(500).json({ error: "Failed to fetch area_calculation_historys" });
      } else {
        res.json(result);
      }
    });
  });
  
  router.get("/area_cal/:id", (req, res) => {
    const id = req.params.id
    const query = "SELECT *FROM area_calculation_history WHERE  calculation_id = ?";
  
    db.query(query,[id] ,(err, result) => {
      if (err) {
        console.error("Error fetching area_calculation_history " + err);
        res.status(500).json({ error: "Failed to fetch area_calculation_history" });
      } else {
        res.json(result);
      }
    });
  });
  
  
  
  module.exports = router;