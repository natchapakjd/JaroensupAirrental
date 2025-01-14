const express = require("express");
const router = express.Router();
const db = require("../db");
const isAdmin = require('../middlewares/isAdmin');

// Middleware for admin access
// Uncomment if you want to restrict access
// router.use(isAdmin);

router.get("/technicians", (req, res) => {
  const query = `
    SELECT 
      technicians.*,
      users.*
    FROM 
      technicians
    INNER JOIN 
      users 
    ON 
      technicians.user_id = users.user_id
  `;

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
  const id = req.params.id;
  const query = `
    SELECT 
      technicians.*,
      users.*
    FROM 
      technicians
    INNER JOIN 
      users 
    ON 
      technicians.user_id = users.user_id
    WHERE technicians.user_id  = ?
  `;

  db.query(query,[id], (err, result) => {
    if (err) {
      console.error("Error fetching technicians: " + err);
      res.status(500).json({ error: "Failed to fetch technicians" });
    } else {
      res.json(result);
    }
  });
});

router.get("/v2/technician/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT 
      technicians.*,
      users.*
    FROM 
      technicians
    INNER JOIN 
      users 
    ON 
      technicians.user_id = users.user_id
    WHERE technicians.tech_id  = ?
  `;

  db.query(query,[id], (err, result) => {
    if (err) {
      console.error("Error fetching technicians: " + err);
      res.status(500).json({ error: "Failed to fetch technicians" });
    } else {
      res.json(result);
    }
  });
});


router.post('/technician', async (req, res) => {
  const {
    user_id,
    nationality,
    isOutsource,
    work_experience,
    special_skills,
    background_check_status,
    bank_account_number,
    start_date,
    status_id,
    id_card_image_url,
    driver_license_image_url,
    criminal_record_image_url,
    additional_image_url,
  } = req.body;

  try {
    const query = `
      INSERT INTO technicians (
        user_id,
        nationality,
        isOutsource,
        work_experience,
        special_skills,
        background_check_status,
        bank_account_number,
        start_date,
        status_id,
        id_card_image_url,
        driver_license_image_url,
        criminal_record_image_url,
        additional_image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    db.query(query, [
      user_id,
      nationality,
      isOutsource ? 1 : 0,
      work_experience,
      special_skills,
      background_check_status,
      bank_account_number,
      start_date,
      status_id,
      id_card_image_url,
      driver_license_image_url,
      criminal_record_image_url,
      additional_image_url,
    ], (err, result) => {
      if (err) {
        console.error('Error adding technician:', err);
        return res.status(500).json({ message: 'Error adding technician' });
      }
      res.status(201).json({ message: 'Technician added successfully', tech_id: result.insertId });
    });
  } catch (error) {
    console.error('Error adding technician:', error);
    res.status(500).json({ message: 'Error adding technician' });
  }
});

router.put('/technician/:id', async (req, res) => {
  const {
    nationality,
    isOutsource,
    work_experience,
    special_skills,
    background_check_status,
    bank_account_number,
    start_date,
    status_id,
    id_card_image_url,
    driver_license_image_url,
    criminal_record_image_url,
    additional_image_url,
  } = req.body;
  const { id } = req.params;

  try {
    const query = `
      UPDATE technicians
      SET
        nationality = ?,
        isOutsource = ?,
        work_experience = ?,
        special_skills = ?,
        background_check_status = ?,
        bank_account_number = ?,
        start_date = ?,
        status_id = ?,
        id_card_image_url = ?,
        driver_license_image_url = ?,
        criminal_record_image_url = ?,
        additional_image_url = ?
      WHERE user_id = ?
    `;

    db.query(query, [
      nationality,
      isOutsource ? 1 : 0,
      work_experience,
      special_skills,
      background_check_status,
      bank_account_number,
      start_date,
      status_id,
      id_card_image_url,
      driver_license_image_url,
      criminal_record_image_url,
      additional_image_url,
      id,
    ], (err, result) => {
      if (err) {
        console.error('Error updating technician:', err);
        return res.status(500).json({ message: 'Error updating technician' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Technician not found' });
      }

      res.status(200).json({ message: 'Technician updated successfully' });
    });
  } catch (error) {
    console.error('Error updating technician:', error);
    res.status(500).json({ message: 'Error updating technician' });
  }
});


module.exports = router;
