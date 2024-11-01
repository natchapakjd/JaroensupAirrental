const express = require('express');
const router = express.Router();
const db = require("../db");

const months = Array.from({ length: 12 }, (_, i) => i + 1);

router.get("/api/counts", (req, res) => {
    const query = `
        SELECT months.month,
            IFNULL(task_count.count, 0) AS task_count,
            IFNULL(order_count.count, 0) AS order_count,
            IFNULL(payment_count.count, 0) AS payment_count
        FROM (SELECT ${months.join(' AS month UNION SELECT ')} AS month) AS months
        LEFT JOIN (
            SELECT MONTH(created_at) AS month, COUNT(*) AS count 
            FROM tasks 
            WHERE YEAR(created_at) = 2024 
            GROUP BY MONTH(created_at)
        ) AS task_count ON months.month = task_count.month
        LEFT JOIN (
            SELECT MONTH(created_at) AS month, COUNT(*) AS count 
            FROM orders 
            WHERE YEAR(created_at) = 2024 
            GROUP BY MONTH(created_at)
        ) AS order_count ON months.month = order_count.month
        LEFT JOIN (
            SELECT MONTH(created_at) AS month, COUNT(*) AS count 
            FROM payments 
            WHERE YEAR(created_at) = 2024 
            GROUP BY MONTH(created_at)
        ) AS payment_count ON months.month = payment_count.month
        ORDER BY months.month
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching counts: " + err);
            res.status(500).json({ error: "Failed to fetch counts" });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
