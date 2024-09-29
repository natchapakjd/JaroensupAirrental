const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/technicians", (req, res) => {
  const query = "SELECT * FROM  technicians ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching technicians: " + err);
      res.status(500).json({ error: "Failed to fetch technicians" });
    } else {
      res.json(result);
    }
  });
});

router.get("/technician/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM technician WHERE  tech_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching technician " + err);
      res.status(500).json({ error: "Failed to fetch technician" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;