const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/tasktypes", (req, res) => {
  const query = "SELECT * FROM  tasktypes ";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching tasktype: " + err);
      res.status(500).json({ error: "Failed to fetch tasktype" });
    } else {
      res.json(result);
    }
  });
});

router.get("/tasktype/:id", (req, res) => {
  const id = req.params.id
  const query = "SELECT *FROM tasktypes WHERE  task_type_id = ?";

  db.query(query,[id] ,(err, result) => {
    if (err) {
      console.error("Error fetching tasktypes" + err);
      res.status(500).json({ error: "Failed to fetch tasktype" });
    } else {
      res.json(result);
    }
  });
});



module.exports = router;