const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/statuses', (req, res) => {
    const query = 'SELECT * FROM status';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching status:', err);
            res.status(500).json({ error: 'Failed to fetch status' });
        } else {
            res.json(results);
        }
    });
});


module.exports = router;
