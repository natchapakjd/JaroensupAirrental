const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/adminLogs", (req, res) => {
  const query = "SELECT * FROM  adminlogs ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching adminlogs: " + err);
      res.status(500).json({ error: "Failed to fetch adminlogs" });
    } else {
      res.json(result);
    }
  });
});

router.get("/adminLog/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM adminlogs WHERE  log_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching adminLog " + err);
      res.status(500).json({ error: "Failed to fetch adminLog" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;