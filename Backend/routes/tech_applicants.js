const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/applicants", (req, res) => {
  const query = "SELECT * FROM  technician_applicants ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching applicants: " + err);
      res.status(500).json({ error: "Failed to fetch applicants" });
    } else {
      res.json(result);
    }
  });
});

router.get("/applicant/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM technician_applicants WHERE  applicant_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching applicant" + err);
      res.status(500).json({ error: "Failed to fetch applicant" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;