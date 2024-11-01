const express = require('express');
const router = express.Router();
const db = require('../db');
const isAdmin = require('../middlewares/isAdmin');


router.get('/service_areas', (req, res) => {
    const query = 'SELECT * FROM service_areas';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching service_areas:', err);
            res.status(500).json({ error: 'Failed to fetch service_areas' });
        } else {
            res.json(results);
        }
    });
});

router.get('/service_area/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service_area ID' });
    }

    const query = 'SELECT * FROM service_areas WHERE service_area_id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching service_area:', err);
            res.status(500).json({ error: 'Failed to fetch service_area' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Service area not found' });
        } else {
            res.json(results[0]);
        }
    });
});

router.post('/service_area', (req, res) => {
    const { tech_id, area_name, description } = req.body;

    if (!tech_id || !area_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO service_areas (tech_id, area_name, description) VALUES (?, ?, ?)';

    db.query(query, [tech_id, area_name, description], (err, results) => {
        if (err) {
            console.error('Error creating service_area:', err);
            res.status(500).json({ error: 'Failed to create service_area' });
        } else {
            res.status(201).json({ service_area_id: results.insertId, tech_id, area_name, description });
        }
    });
});

router.put('/service_area/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { tech_id, area_name, description } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service_area ID' });
    }

    const query = 'UPDATE service_areas SET tech_id = ?, area_name = ?, description = ? WHERE service_area_id = ?';

    db.query(query, [tech_id, area_name, description, id], (err, results) => {
        if (err) {
            console.error('Error updating service_area:', err);
            res.status(500).json({ error: 'Failed to update service_area' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Service area not found' });
        } else {
            res.json({ message: 'Service area updated successfully' });
        }
    });
});

router.delete('/service_area/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service_area ID' });
    }

    const query = 'DELETE FROM service_areas WHERE service_area_id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting service_area:', err);
            res.status(500).json({ error: 'Failed to delete service_area' });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Service area not found' });
        } else {
            res.json({ message: 'Service area deleted successfully' });
        }
    });
});

module.exports = router;
