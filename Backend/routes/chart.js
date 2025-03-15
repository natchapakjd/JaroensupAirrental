const express = require('express');
const router = express.Router();
const db = require("../db");

const months = Array.from({ length: 12 }, (_, i) => i + 1);

router.get("/api/counts", (req, res) => {
    const query = `
        SELECT 
            months.month,
            IFNULL(task_count.count, 0) AS task_count,
            IFNULL(order_count.count, 0) AS order_count,
            IFNULL(payment_count.count, 0) AS payment_count,
            IFNULL(income.amount, 0) AS income
        FROM (SELECT ${months.join(' AS month UNION SELECT ')} AS month) AS months
        LEFT JOIN (
            SELECT MONTH(created_at) AS month, COUNT(*) AS count 
            FROM tasks 
            WHERE YEAR(created_at) = YEAR(CURDATE()) 
            AND task_type_id IN (1, 12)
            GROUP BY MONTH(created_at)
        ) AS task_count ON months.month = task_count.month
        LEFT JOIN (
            SELECT MONTH(created_at) AS month, COUNT(*) AS count 
            FROM orders 
            WHERE YEAR(created_at) = YEAR(CURDATE()) 
            GROUP BY MONTH(created_at)
        ) AS order_count ON months.month = order_count.month
        LEFT JOIN (
            SELECT MONTH(created_at) AS month, COUNT(*) AS count 
            FROM payments 
            WHERE YEAR(created_at) = YEAR(CURDATE()) 
            GROUP BY MONTH(created_at)
        ) AS payment_count ON months.month = payment_count.month
        LEFT JOIN (
            SELECT 
                MONTH(t.created_at) AS month,
                SUM(COALESCE(t.total, 0) + COALESCE(p.amount, 0)) AS amount 
            FROM tasks t
            LEFT JOIN payments p ON t.task_id = p.task_id AND p.status_id = 2
            WHERE t.status_id = 2
            AND YEAR(t.created_at) = YEAR(CURDATE())
            GROUP BY MONTH(t.created_at)
        ) AS income ON months.month = income.month
        ORDER BY months.month
    `;

    const userCountQuery = `
        SELECT 
            r.role_name,
            COUNT(u.user_id) AS count
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE r.role_name IN ('technician', 'customer')
        GROUP BY r.role_name
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching counts: " + err);
            return res.status(500).json({ error: "Failed to fetch counts" });
        }

        db.query(userCountQuery, (err, userCounts) => {
            if (err) {
                console.error("Error fetching user counts: " + err);
                return res.status(500).json({ error: "Failed to fetch user counts" });
            }

            const summary = {
                monthlyData: result,
                userCounts: {
                    technicians: userCounts.find((u) => u.role_name === 'technician')?.count || 0,
                    customers: userCounts.find((u) => u.role_name === 'customer')?.count || 0,
                },
            };

            res.json(summary);
        });
    });
});

module.exports = router;