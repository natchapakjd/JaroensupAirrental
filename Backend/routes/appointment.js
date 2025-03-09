const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

router.get("/appointments", (req, res) => {
  const query = `
    SELECT 
      taskassignments.*,
      technicians.*,
      tasks.*,
      users.* 
    FROM 
      taskassignments
    INNER JOIN 
      technicians ON taskassignments.tech_id = technicians.tech_id
    INNER JOIN 
      tasks ON taskassignments.task_id = tasks.task_id
    INNER JOIN 
      users ON technicians.user_id = users.user_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching appointments: " + err);
      res.status(500).json({ error: "Failed to fetch appointments" });
    } else {
      res.json(result);
    }
  });
});

router.get("/appointment/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM taskassignments WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching appointment: " + err);
      res.status(500).json({ error: "Failed to fetch appointment" });
    } else {
      res.json(result);
    }
  });
});

router.get("/assignments-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // ตั้งค่าหน้าเริ่มต้นที่ 1 และจำนวนรายการต่อหน้าเป็น 10 ถ้าไม่มีค่า
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) AS total FROM taskassignments";
  const dataQuery = `
    SELECT 
      taskassignments.*,
      technicians.*,
      tasks.*,
      users.*
    FROM 
      taskassignments
    INNER JOIN 
      technicians ON taskassignments.tech_id = technicians.tech_id
    INNER JOIN 
      tasks ON taskassignments.task_id = tasks.task_id
    INNER JOIN 
      users ON technicians.user_id = users.user_id
    LIMIT ? OFFSET ?
  `;

  // นับจำนวนทั้งหมดของ assignments
  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error fetching total assignments count:", err);
      return res.status(500).json({ error: "Failed to fetch assignments count" });
    }

    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    // ดึงข้อมูล assignments พร้อมแบ่งหน้า
    db.query(dataQuery, [parseInt(limit), offset], (err, result) => {
      if (err) {
        console.error("Error fetching assignments:", err);
        return res.status(500).json({ error: "Failed to fetch assignments" });
      }

      // ส่งข้อมูล assignments พร้อมข้อมูลการแบ่งหน้า
      res.json({
        data: result,
        total: {
          totalCount,
          totalPages,
          currentPage: parseInt(page),
        },
      });
    });
  });
});


router.get("v2/appointment/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT 
      taskassignments.*,
      technicians.*,
      tasks.*,
      users.* 
    FROM 
      taskassignments
    INNER JOIN 
      technicians ON taskassignments.tech_id = technicians.tech_id
    INNER JOIN 
      tasks ON taskassignments.task_id = tasks.task_id
    INNER JOIN 
      users ON technicians.user_id = users.user_id
    WHERE tasks.task_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching appointment: " + err);
      res.status(500).json({ error: "Failed to fetch appointment" });
    } else {
      const isAssigned = result.length > 0;
      res.json({ appointment: result, isAssigned });
    }
  });
});

router.get("/appointment-assign/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM taskassignments WHERE assignment_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching appointment: " + err);
      res.status(500).json({ error: "Failed to fetch appointment" });
    } else {
      res.json(result);
    }
  });
});

router.post("/appointments", (req, res) => {
  const { tech_id, task_id } = req.body;

  const insertQuery = "INSERT INTO taskassignments (tech_id, task_id) VALUES (?, ?)";

  db.query(insertQuery, [tech_id, task_id], (err, result) => {
    if (err) {
      console.error("Error creating appointment: " + err);
      return res.status(500).json({ error: "Failed to create appointment" });
    }

    const updateQuery = "UPDATE tasks SET status_id = 5 WHERE task_id = ?";
    
    db.query(updateQuery, [task_id], (err, updateResult) => {
      if (err) {
        console.error("Error updating task status: " + err);
        return res.status(500).json({ error: "Failed to update task status" });
      }

      res.status(201).json({ appointment_id: result.insertId, message: "Task assigned and status updated" });
    });
  });
});

router.post("/v2/appointments", (req, res) => {
  const { tech_ids, task_id } = req.body; // tech_ids เป็นอาร์เรย์ของ tech_id
  if (!Array.isArray(tech_ids) || tech_ids.length === 0) {
    return res.status(400).json({ error: "Tech IDs must be an array with at least one value" });
  }

  // สร้าง query สำหรับหลายช่าง
  const insertQuery = "INSERT INTO taskassignments (tech_id, task_id) VALUES ?";
  const values = tech_ids.map((tech_id) => [tech_id, task_id]);

  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error("Error assigning tasks: " + err);
      return res.status(500).json({ error: "Failed to assign tasks" });
    }

    // อัปเดตสถานะของ Task เมื่อมีการมอบหมายงานแล้ว
    const updateQuery = "UPDATE tasks SET status_id = 5 WHERE task_id = ?";
    
    db.query(updateQuery, [task_id], (err, updateResult) => {
      if (err) {
        console.error("Error updating task status: " + err);
        return res.status(500).json({ error: "Failed to update task status" });
      }

      res.status(201).json({
        message: "Task assigned to multiple technicians and status updated",
        insertedRows: result.affectedRows, // บอกว่ามีช่างกี่คนถูกเพิ่ม
      });
    });
  });
});

router.put("/appointment/:id", (req, res) => {
  const id = req.params.id;
  const { tech_id, task_id } = req.body;
  const query = "UPDATE taskassignments SET tech_id = ?, task_id = ?  WHERE assignment_id = ?";
  db.query(query, [tech_id, task_id, id], (err, result) => {
    if (err) {
      console.error("Error updating appointment: " + err);
      res.status(500).json({ error: "Failed to update appointment" });
    } else {
      res.status(200).json({ message: "Appointment updated successfully" });
    }
  });
});

router.delete("/appointment/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM taskassignments WHERE assignment_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting appointment: " + err);
      res.status(500).json({ error: "Failed to delete appointment" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Appointment not found" });
    } else {
      res.status(200).send();
    }
  });
});

module.exports = router;
