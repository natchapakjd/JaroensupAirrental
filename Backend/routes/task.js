const express = require("express");
const router = express.Router();
const db = require("../db");
const cron = require("node-cron");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const isAdmin = require('../middlewares/isAdmin');
const cloudinary = require('../cloundinary-config')

const storage = multer.diskStorage({
  destination: "uploads/task-images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

cron.schedule("0 0 * * *", () => {
  const query = `
    DELETE FROM tasks 
    WHERE isActive = 0 AND updatedAt < NOW() - INTERVAL 1 DAY`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error deleting old inactive tasks: ", err);
    } else {
      console.log(`Deleted ${result.affectedRows} old inactive tasks.`);
    }
  });
});

router.get("/task-paging", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = "SELECT t.*,tt.type_name ,st.status_name,st.status_id,us.firstname,us.lastname,us.phone FROM tasks t JOIN status st ON t.status_id = st.status_id JOIN tasktypes tt ON t.task_type_id = tt.task_type_id JOIN users us ON t.user_id = us.user_id LIMIT ? OFFSET ?";

  db.query(query, [limit, offset], (err, result) => {
    if (err) {
      console.error("Error fetching tasks: " + err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    db.query("SELECT COUNT(*) AS total FROM tasks ", (err, countResult) => {
      if (err) {
        console.error("Error counting tasks: " + err);
        return res.status(500).json({ error: "Failed to count tasks" });
      }

      const totalTasks = countResult[0].total;
      res.json({
        tasks: result,
        totalTasks,
      });
    });
  });
});

router.get("/task-paging/:id", (req, res) => {
  const userId = req.params.id;
  const limit = parseInt(req.query.limit) || 10; // Default to 10 if no limit is specified
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is specified
  const offset = (page - 1) * limit; // Calculate the offset based on page and limit

  // Main query to get tasks with pagination, filter by task_type_id, and order by latest created_at
  let query = `
    SELECT t.*, tt.type_name, st.status_name, us.firstname, us.lastname,us.phone
    FROM tasks t 
    JOIN status st ON t.status_id = st.status_id  
    JOIN tasktypes tt ON t.task_type_id = tt.task_type_id 
    JOIN users us ON t.user_id = us.user_id
    WHERE t.user_id = ? AND (t.task_type_id = 1 OR t.task_type_id = 12) AND t.isActive = 1 
    ORDER BY t.created_at DESC 
    LIMIT ? OFFSET ?
  `;

  const queryParams = [userId, limit, offset];

  // Query the tasks
  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error fetching tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    // Count query to get the total number of tasks for the user with task_type_id = 1 or 12
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM tasks 
      WHERE user_id = ? AND (task_type_id = 1 OR task_type_id = 12) AND isActive = 1
    `;

    db.query(countQuery, [userId], (err, countResult) => {
      if (err) {
        console.error("Error fetching task count: ", err);
        return res.status(500).json({ error: "Failed to fetch task count" });
      }

      const totalTasks = countResult[0].total;

      // Send the response with tasks and the total task count
      res.status(200).json({
        tasks: result,
        totalTasks: totalTasks,
      });
    });
  });
});

router.get("/tasks/paged", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      tasks.*, 
      users.username,
      users.firstname,
      users.lastname,
      users.phone,
      tasktypes.type_name,
      status.status_name,
      GROUP_CONCAT(DISTINCT rental.product_id ORDER BY rental.product_id ASC) AS rental_product_ids,
      GROUP_CONCAT(DISTINCT rental.rental_start_date ORDER BY rental.product_id ASC) AS rental_start_dates,
      GROUP_CONCAT(DISTINCT rental.rental_end_date ORDER BY rental.product_id ASC) AS rental_end_dates
    FROM 
      tasks 
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    LEFT JOIN 
      rental ON tasks.task_id = rental.task_id
    WHERE 
      tasks.isActive = 1 
      AND (tasks.task_type_id = 1 OR tasks.task_type_id = 12)
    GROUP BY 
      tasks.task_id
    LIMIT ? OFFSET ?;
  `;

  const countQuery = `SELECT COUNT(DISTINCT task_id) AS total FROM tasks WHERE task_type_id = 1 and isActive = 1`;

  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error counting tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks count" });
    }

    const total = countResult[0].total;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        console.error("Error fetching paged tasks: ", err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }

      res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        tasks: result,
      });
    });
  });
});


router.get("/v2/tasks/paged", (req, res) => {
  const { page = 1, limit = 10, user_id } = req.query; // รับ user_id จาก query params
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      tasks.*, 
      users.username,
      tasktypes.type_name,
      status.status_name
    FROM 
      tasks
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    WHERE 
        tasks.isActive = 1 
        AND (tasks.task_type_id = 1 OR tasks.task_type_id = 12)
  `;

  let countQuery = `
    SELECT COUNT(*) AS total 
    FROM tasks 
    WHERE task_type_id = 1 
      AND isActive = 1
  `;

  let queryParams = [];
  let countParams = [];

  if (user_id) {
    query += " AND tasks.user_id = ?";
    countQuery += " AND user_id = ?";
    queryParams.push(user_id);
    countParams.push(user_id);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(parseInt(limit), parseInt(offset));

  db.query(countQuery, countParams, (err, countResult) => {
    if (err) {
      console.error("Error counting tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks count" });
    }

    const total = countResult[0].total;

    db.query(query, queryParams, (err, result) => {
      if (err) {
        console.error("Error fetching paged tasks: ", err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }

      res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        tasks: result,
      });
    });
  });
});

router.get("/task/:id", (req, res) => {
  const taskId = req.params.id;

  const query = `
    SELECT 
      tasks.*, 
      tasktypes.type_name,
      status.*,
      rental.*,
      users.firstname,
      users.lastname,
      users.phone
    FROM 
      tasks
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    INNER JOIN
      rental ON tasks.task_id = rental.task_id
    WHERE 
      tasks.task_id = ?
  `;

  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching task: ", err);
      return res.status(500).json({ error: "Failed to fetch task" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(result[0]);
  });
});



router.get("/tasks", (req, res) => {
  const query = `
    SELECT 
      tasks.*, 
      users.*,
      tasktypes.description as tt_description,
      tasktypes.type_name as task_type_name,
      status.*
    FROM 
      tasks
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    WHERE 
        tasks.isActive = 1 
        AND (tasks.task_type_id = 1 OR tasks.task_type_id = 12)
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    res.status(200).json(result);
  });
});

router.post("/tasks", (req, res) => {
  const {
    user_id,
    description,
    task_type_id,
    quantity_used,
    address,
    appointment_date,
    latitude,
    longitude,
    rental_start_date,
    rental_end_date,
    organization_name, // ✅ เพิ่ม organization_name
  } = req.body;

  const query = `
    INSERT INTO tasks 
    (user_id, description, task_type_id, quantity_used, address, appointment_date, latitude, longitude, isActive, organization_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      user_id,
      description,
      task_type_id,
      quantity_used,
      address,
      appointment_date,
      latitude,
      longitude,
      1,
      organization_name || null, // ✅ เพิ่ม organization_name (อนุญาตให้เป็น null ได้)
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating task: " + err);
        return res.status(500).json({ error: "Failed to create task" });
      }

      const taskId = result.insertId;

      const rentalQuery = `
        INSERT INTO rental (task_id, rental_start_date, rental_end_date) 
        VALUES (?, ?, ?)
      `;

      db.query(rentalQuery, [taskId, rental_start_date, rental_end_date], (err) => {
        if (err) {
          console.error("Error creating rental record: " + err);
          return res.status(500).json({ error: "Failed to create rental record" });
        }

        res.status(201).json({
          task_id: taskId,
          user_id,
          description,
          task_type_id,
          quantity_used,
          address,
          appointment_date,
          latitude,
          longitude,
          rental_start_date,
          rental_end_date,
          organization_name, // ✅ เพิ่มใน response
        });
      });
    }
  );
});

router.put("/task/:id", (req, res) => {
  const id = req.params.id;

  const {
    user_id,
    description,
    task_type_id,
    quantity_used,
    address,
    appointment_date,
    latitude,
    longitude,
    status_id,
    rental_start_date,
    rental_end_date,
    total
  } = req.body;

  console.log(req.body);

  // Format appointment_date to MySQL format (YYYY-MM-DD HH:MM:SS)
  const formattedAppointmentDate = new Date(appointment_date).toISOString().slice(0, 19).replace('T', ' ');

  // Format rental_start_date and rental_end_date to YYYY-MM-DD (no time)
  const formattedRentalStartDate = new Date(rental_start_date).toISOString().slice(0, 10);  // 'YYYY-MM-DD'
  const formattedRentalEndDate = new Date(rental_end_date).toISOString().slice(0, 10);  // 'YYYY-MM-DD'

  // Update the task
  const updateTaskQuery = `
    UPDATE tasks
    SET 
      user_id = ?,
      description = ?,
      task_type_id = ?,
      quantity_used = ?,
      address = ?,
      appointment_date = ?,
      latitude = ?,
      longitude = ?,
      status_id = ?,
      total = ?
    WHERE task_id = ?`;

  db.query(
    updateTaskQuery,
    [
      user_id,
      description,
      task_type_id,
      quantity_used,
      address,
      formattedAppointmentDate,
      latitude,
      longitude,
      status_id,
      total,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating task: " + err);
        return res.status(500).json({ error: "Failed to update task" });
      }

      // Check if rental data exists for this task
      const checkRentalQuery = "SELECT * FROM rental WHERE task_id = ?";
      db.query(checkRentalQuery, [id], (err, rentalResult) => {
        if (err) {
          console.error("Error checking rental record: " + err);
          return res.status(500).json({ error: "Failed to check rental record" });
        }

        if (rentalResult.length > 0) {
          // Update existing rental record
          const updateRentalQuery = `
            UPDATE rental
            SET rental_start_date = ?, rental_end_date = ?
            WHERE task_id = ?`;

          db.query(
            updateRentalQuery,
            [formattedRentalStartDate, formattedRentalEndDate, id],
            (err) => {
              if (err) {
                console.error("Error updating rental record: " + err);
                return res.status(500).json({ error: "Failed to update rental record" });
              }

              res.status(200).json({
                task_id: id,
                user_id,
                description,
                task_type_id,
                quantity_used,
                address,
                appointment_date,
                latitude,
                longitude,
                rental_start_date: formattedRentalStartDate,
                rental_end_date: formattedRentalEndDate,
              });
            }
          );
        } else {
          // Insert a new rental record
          const insertRentalQuery = `
            INSERT INTO rental (task_id, rental_start_date, rental_end_date)
            VALUES (?, ?, ?)`;

          db.query(
            insertRentalQuery,
            [id, formattedRentalStartDate, formattedRentalEndDate],
            (err) => {
              if (err) {
                console.error("Error creating rental record: " + err);
                return res.status(500).json({ error: "Failed to create rental record" });
              }

              res.status(200).json({
                task_id: id,
                user_id,
                description,
                task_type_id,
                quantity_used,
                address,
                appointment_date,
                latitude,
                longitude,
                rental_start_date: formattedRentalStartDate,
                rental_end_date: formattedRentalEndDate,
              });
            }
          );
        }
      });
    }
  );
});

router.delete("/task/:id", (req, res) => {
  const id = req.params.id;

  // คำสั่ง SQL
  const getAssignmentId = "SELECT assignment_id FROM taskassignments WHERE task_id = ?";
  const getCalculationId = "SELECT calculation_id FROM area_calculation_history WHERE assignment_id = ?";
  const deleteAreaImages = "DELETE FROM area_images WHERE area_calculation_id = ?";
  const deletePayments = "DELETE FROM payments WHERE task_id = ?";
  const deleteAreaCalcHistory = "DELETE FROM area_calculation_history WHERE assignment_id = ?";
  const deleteTaskAssignments = "DELETE FROM taskassignments WHERE task_id = ?";
  const updateTask = "UPDATE tasks SET isActive = 0, status_id = 3 WHERE task_id = ?";

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error: " + err);
      return res.status(500).json({ error: "Transaction failed" });
    }

    // ดึง assignment_id จาก taskassignments
    db.query(getAssignmentId, [id], (err, assignmentResults) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error fetching assignment_id: " + err);
          res.status(500).json({ error: "Failed to fetch assignment_id" });
        });
      }

      // ถ้ามี assignment_id ให้เก็บไว้ ถ้าไม่มีก็ข้ามไป
      const assignmentId = assignmentResults.length > 0 ? assignmentResults[0].assignment_id : null;

      // ดึง calculation_id จาก area_calculation_history โดยใช้ assignment_id
      const fetchCalculationId = (callback) => {
        if (assignmentId) {
          db.query(getCalculationId, [assignmentId], (err, calcResults) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error fetching calculation_id: " + err);
                res.status(500).json({ error: "Failed to fetch calculation_id" });
              });
            }
            const calculationId = calcResults.length > 0 ? calcResults[0].calculation_id : null;
            callback(calculationId);
          });
        } else {
          callback(null); // ถ้าไม่มี assignment_id ให้ส่ง calculationId เป็น null
        }
      };

      fetchCalculationId((calculationId) => {
        // ฟังก์ชันสำหรับดำเนินการลบต่อ
        const proceedWithDeletion = () => {
          // ลบ payments
          db.query(deletePayments, [id], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error deleting payments: " + err);
                res.status(500).json({ error: "Failed to delete payments" });
              });
            }

            // ลบ area_calculation_history (ถ้ามี assignmentId)
            if (assignmentId) {
              db.query(deleteAreaCalcHistory, [assignmentId], (err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Error deleting area_calculation_history: " + err);
                    res.status(500).json({ error: "Failed to delete area calculation history" });
                  });
                }
                continueDeletion();
              });
            } else {
              continueDeletion();
            }
          });
        };

        // ฟังก์ชันสำหรับดำเนินการลบตารางที่เหลือ
        const continueDeletion = () => {
          // ลบ taskassignments
          db.query(deleteTaskAssignments, [id], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error deleting taskassignments: " + err);
                res.status(500).json({ error: "Failed to delete task assignments" });
              });
            }

            // อัปเดต tasks
            db.query(updateTask, [id], (err, result) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error updating task: " + err);
                  res.status(500).json({ error: "Failed to update task status" });
                });
              }

              if (result.affectedRows === 0) {
                return db.rollback(() => {
                  res.status(404).json({ error: "Task not found" });
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error("Transaction commit error: " + err);
                    res.status(500).json({ error: "Transaction commit failed" });
                  });
                }
                res.status(204).send();
              });
            });
          });
        };

        // ถ้ามี calculationId ให้ลบ area_images ก่อน
        if (calculationId) {
          db.query(deleteAreaImages, [calculationId], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error deleting area_images: " + err);
                res.status(500).json({ error: "Failed to delete area images" });
              });
            }
            proceedWithDeletion();
          });
        } else {
          // ถ้าไม่มี calculationId ให้ดำเนินการลบตารางอื่นต่อเลย
          proceedWithDeletion();
        }
      });
    });
  });
});

router.delete("/v2/task/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM tasks WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting task: " + err);
      res.status(500).json({ error: "Failed to delete task" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(204).send();
    }
  });
});

router.get("/tasks/assigned/:techId", (req, res) => {
  const techId = req.params.techId;

  const query = `
    SELECT t.*, ta.assignment_id, ta.assigned_at,tt.*,st.status_name
    FROM tasks t
    JOIN taskassignments ta ON t.task_id = ta.task_id
    JOIN tasktypes tt ON t.task_type_id = tt.task_type_id
    JOIN status st ON t.status_id  = st.status_id
    WHERE ta.tech_id = ?
  `;

  db.query(query, [techId], (err, results) => {
    if (err) {
      console.error("Error fetching assigned tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch assigned tasks" });
    }

    res.status(200).json({
      tasks: results,
      count: results.length, 
    });
  });
});

router.put("/task-tech/:id", (req, res) => {
  const id = req.params.id;
  const { status_id, start_date, finish_date } = req.body;
  const query = `
    UPDATE tasks
    SET 
      status_id = ?,
      start_date = ?,
      finish_date = ?
    WHERE task_id = ?`;

  // Execute query with parameter values
  db.query(
    query,
    [status_id, start_date, finish_date, id],
    (err, result) => {
      if (err) {
        console.error("Error updating task: " + err);
        res.status(500).json({ error: "Failed to update task" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Task not found" });
      } else {
        res.json({
          message: "Task updated successfully",
          task_id: id,
          status_id,
          start_date,
          finish_date,
        });
      }
    }
  );
});

router.post('/rental-with-price', (req, res) => {
  const { task_id, rentals } = req.body;

  if (!task_id || !rentals || rentals.length === 0) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  const queryGetDates = 'SELECT rental_start_date, rental_end_date FROM rental WHERE task_id = ? LIMIT 1';

  db.query(queryGetDates, [task_id], (err, result) => {
    if (err) {
      console.error('Error fetching existing rental dates: ', err);
      return res.status(500).json({ message: 'Failed to fetch existing rental dates' });
    }

    const existingRentalDates = result.length > 0 ? result[0] : {};
    const defaultDate = new Date().toISOString().split('T')[0];

    const rentalValues = rentals.map((rental) => [
      task_id,
      rental.product_id,
      existingRentalDates.rental_start_date || rental.rental_start_date || defaultDate,
      existingRentalDates.rental_end_date || rental.rental_end_date || defaultDate,
      rental.quantity,
      rental.price,
      rental.amount,
    ]);

    const queryInsertRental = `
      INSERT INTO rental (task_id, product_id, rental_start_date, rental_end_date, quantity, price, amount)
      VALUES ?
    `;

    db.query(queryInsertRental, [rentalValues], (err, rentalResult) => {
      if (err) {
        console.error('Error inserting rental data: ', err);
        return res.status(500).json({ message: 'Failed to add rental data' });
      }

      // อัพเดท stock_quantity และ capacity
      rentals.forEach((rental) => {
        const updateProductQuery = `
          UPDATE products
          SET stock_quantity = stock_quantity - ?
          WHERE product_id = ?
        `;
        db.query(updateProductQuery, [rental.quantity, rental.product_id], (err) => {
          if (err) {
            console.error('Error updating product stock_quantity:', err);
            return res.status(500).json({ message: 'Failed to update product stock_quantity' });
          }

          const getWarehouseQuery = `
            SELECT warehouse_id FROM products WHERE product_id = ?
          `;
          db.query(getWarehouseQuery, [rental.product_id], (err, warehouseResult) => {
            if (err || warehouseResult.length === 0) {
              console.error('Error retrieving warehouse ID:', err);
              return;
            }

            const warehouseId = warehouseResult[0].warehouse_id;
            const updateWarehouseCapacityQuery = `
              UPDATE warehouses
              SET capacity = capacity - ?
              WHERE warehouse_id = ?
            `;
            db.query(updateWarehouseCapacityQuery, [rental.quantity, warehouseId], (err) => {
              if (err) {
                console.error('Error updating warehouse capacity:', err);
              }
            });
          });
        });
      });

      // คำนวณ total amount
      const totalAmount = rentals.reduce((total, r) => total + Number(r.amount), 0);

      // ดึงผลรวมของ quantity จาก rental สำหรับ task_id นี้
      const querySumQuantity = `
        SELECT SUM(quantity) AS total_quantity_used 
        FROM rental 
        WHERE task_id = ?
      `;
      db.query(querySumQuantity, [task_id], (err, quantityResult) => {
        if (err) {
          console.error('Error fetching total quantity used: ', err);
          return res.status(500).json({ message: 'Failed to fetch total quantity used' });
        }

        const totalQuantityUsed = quantityResult[0].total_quantity_used || 0;

        // อัพเดท tasks ด้วย status_id = 4, quantity_used (ผลรวมทั้งหมด), และ total
        const updateTaskQuery = `
          UPDATE tasks 
          SET status_id = 4, quantity_used = ?, total = total + ?
          WHERE task_id = ?
        `;
        db.query(updateTaskQuery, [totalQuantityUsed, totalAmount, task_id], (err) => {
          if (err) {
            console.error('Error updating task status and total: ', err);
            return res.status(500).json({ message: 'Failed to update task status and total' });
          }

          // ดึง user_id จาก tasks
          const queryGetUserId = `
            SELECT user_id 
            FROM tasks 
            WHERE task_id = ?
          `;
          db.query(queryGetUserId, [task_id], (err, userResult) => {
            if (err) {
              console.error('Error fetching user_id from tasks: ', err);
              return res.status(500).json({ message: 'Failed to fetch user_id from tasks' });
            }

            if (userResult.length === 0) {
              return res.status(404).json({ message: 'Task not found' });
            }

            const userId = userResult[0].user_id;

            // สร้างการชำระเงินอัตโนมัติโดยใช้ user_id จาก tasks
            const paymentQuery = `
              INSERT INTO payments (amount, user_id, task_id, method_id, image_url, status_id)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            const paymentValues = [
              totalAmount,  // จำนวนเงินจาก totalAmount
              userId,       // user_id จาก tasks
              task_id,      // task_id จาก request
              1,            // method_id (เช่น 1 = อัตโนมัติ)
              null,         // image_url เป็น null เพราะไม่มี slip
              1             // status_id (เช่น 1 = สำเร็จทันที)
            ];

            db.query(paymentQuery, paymentValues, (err, paymentResult) => {
              if (err) {
                console.error('Error creating automatic payment: ', err);
                return res.status(500).json({ message: 'Failed to create automatic payment' });
              }

              return res.status(200).json({ 
                message: 'Rental data added successfully, quantities, total, and payment updated',
                payment_id: paymentResult.insertId 
              });
            });
          });
        });
      });
    });
  });
});

router.post('/rental', (req, res) => {
  const { task_id, rentals } = req.body;

  // ตรวจสอบข้อมูลที่ได้รับ
  if (!task_id || !rentals || rentals.length === 0) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // ดึงข้อมูล rental_start_date และ rental_end_date เดิมจากฐานข้อมูล
  const queryGetDates = 'SELECT rental_start_date, rental_end_date FROM rental WHERE task_id = ? LIMIT 1';

  db.query(queryGetDates, [task_id], (err, result) => {
    if (err) {
      console.error('Error fetching existing rental dates: ', err);
      return res.status(500).json({ message: 'Failed to fetch existing rental dates' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Task ID not found' });
    }

    const existingRentalDates = result[0];

    // สร้างคำสั่ง SQL สำหรับเพิ่มข้อมูลการเช่าโดยใช้วันที่เดิม
    const rentalValues = rentals.map((rental) => [
      task_id,
      rental.product_id,
      existingRentalDates.rental_start_date || new Date().toISOString().split('T')[0],
      existingRentalDates.rental_end_date || new Date().toISOString().split('T')[0],
      rental.quantity,
    ]);

    const queryInsert = 'INSERT INTO rental (task_id, product_id, rental_start_date, rental_end_date, quantity) VALUES ?';

    db.query(queryInsert, [rentalValues], (err, result) => {
      if (err) {
        console.error('Error inserting rental data: ', err);
        return res.status(500).json({ message: 'Failed to add rental data' });
      }

      // ลดจำนวน stock_quantity ใน products และ capacity ใน warehouses ตามจำนวนที่เช่า
      rentals.forEach((rental) => {
        const updateProductQuery = `
          UPDATE products
          SET stock_quantity = stock_quantity - ?
          WHERE product_id = ?
        `;

        db.query(updateProductQuery, [rental.quantity, rental.product_id], (err) => {
          if (err) {
            console.error('Error updating product stock_quantity:', err);
            return res.status(500).json({ message: 'Failed to update product stock_quantity' });
          }

          // ลด capacity ใน warehouses ที่เก็บสินค้า
          const getWarehouseQuery = `
            SELECT warehouse_id FROM products WHERE product_id = ?
          `;

          db.query(getWarehouseQuery, [rental.product_id], (err, warehouseResult) => {
            if (err) {
              console.error('Error retrieving warehouse ID:', err);
              return res.status(500).json({ message: 'Failed to retrieve warehouse ID' });
            }

            if (warehouseResult.length > 0) {
              const warehouseId = warehouseResult[0].warehouse_id;

              const updateWarehouseCapacityQuery = `
                UPDATE warehouses
                SET capacity = capacity - ?
                WHERE warehouse_id = ?
              `;

              db.query(updateWarehouseCapacityQuery, [rental.quantity, warehouseId], (err) => {
                if (err) {
                  console.error('Error updating warehouse capacity:', err);
                  return res.status(500).json({ message: 'Failed to update warehouse capacity' });
                }
              });
            }
          });
        });
      });

      // คำนวณ total quantity_used และอัพเดตใน tasks
      const totalQuantityUsed = rentals.reduce((total, rental) => total + Number(rental.quantity), 0);  // Ensures it's a number

      // อัพเดทสถานะของงานเป็น status_id = 4 และ quantity_used
      const updateTaskStatusQuery = `
        UPDATE tasks 
        SET status_id = 4, quantity_used = quantity_used + ? 
        WHERE task_id = ?
      `;
      db.query(updateTaskStatusQuery, [totalQuantityUsed, task_id], (err) => {
        if (err) {
          console.error('Error updating task status:', err);
          return res.status(500).json({ message: 'Failed to update task status' });
        }

        return res.status(200).json({ message: 'Rental data added successfully, quantities updated, and task status updated' });
      });
    });
  });
});

// rental/return endpoint สำหรับคืนทรัพยากร
router.put('/rental/return/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    // 1. ค้นหาสินค้าที่ใช้ใน task นี้จากตาราง rental
    const taskItemsQuery = `
      SELECT product_id, quantity 
      FROM rental 
      WHERE task_id = ?
    `;
    db.query(taskItemsQuery, [taskId], (err, taskItemsResult) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: 'Failed to retrieve task items' });
      }

      // ตรวจสอบว่า taskItemsResult มีข้อมูลหรือไม่
      if (taskItemsResult.length === 0) {
        return res.status(400).json({ message: 'No items found for this task' });
      }

      // 2. คำนวณ total quantity used ในการยืมทั้งหมด
      const totalQuantityUsed = taskItemsResult.reduce((total, item) => total + item.quantity, 0);

      // 3. อัพเดตสถานะของ task ให้เป็น 2 (เช่น สถานะ "เสร็จสิ้น")
      const updateStatusQuery = `
        UPDATE tasks 
        SET status_id = 2, quantity_used = ? 
        WHERE task_id = ?
      `;
      db.query(updateStatusQuery, [totalQuantityUsed, taskId], (err, updateStatusResult) => {
        if (err) {
          console.error("Error updating task status:", err);
          return res.status(500).json({ message: 'Failed to update task status' });
        }

        // 4. คืนสินค้ากลับใน products และ warehouses ตามที่ระบุใน task_items
        taskItemsResult.forEach((taskItem) => {
          const { product_id, quantity } = taskItem;

          // 4.1 เพิ่ม stock_quantity ใน products
          const updateProductQuery = `
            UPDATE products 
            SET stock_quantity = stock_quantity + ? 
            WHERE product_id = ?
          `;
          db.query(updateProductQuery, [quantity, product_id]);

          // 4.2 เพิ่ม capacity ใน warehouses
          const getWarehouseQuery = `
            SELECT warehouse_id FROM products WHERE product_id = ?
          `;
          db.query(getWarehouseQuery, [product_id], (err, warehouseResult) => {
            if (err) {
              console.error("Error retrieving warehouse:", err);
              return;
            }
            if (warehouseResult.length > 0) {
              const warehouseId = warehouseResult[0].warehouse_id;

              const updateWarehouseQuery = `
                UPDATE warehouses
                SET capacity = capacity + ? 
                WHERE warehouse_id = ?
              `;
              db.query(updateWarehouseQuery, [quantity, warehouseId]);
            }
          });
        });

        // Send success response
        res.status(200).json({ message: 'Return processed and quantities updated' });
      });
    });
  } catch (error) {
    console.error("Error processing return:", error);
    res.status(500).json({ message: 'Failed to process return' });
  }
});

// Add an API endpoint to check the quantity of items in the rental table
router.get('/rental/quantity/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    // Query to sum up the quantities for the given taskId in the rental table
    const checkQuantityQuery = `
      SELECT SUM(quantity) AS total_quantity
      FROM rental
      WHERE task_id = ?
    `;
    db.query(checkQuantityQuery, [taskId], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: 'Failed to retrieve rental quantities' });
      }

      if (result.length > 0) {
        const totalQuantity = result[0].total_quantity || 0;
        res.status(200).json({ totalQuantity });
      } else {
        res.status(400).json({ message: 'No items found for this task' });
      }
    });
  } catch (error) {
    console.error("Error fetching rental quantities:", error);
    res.status(500).json({ message: 'Failed to process request' });
  }
});

router.get("/tasks/count/:tech_id", (req, res) => {
  const tech_id = parseInt(req.params.tech_id);

  // ตรวจสอบ tech_id
  if (!tech_id || isNaN(tech_id)) {
    return res.status(400).json({ message: "Invalid tech_id" });
  }

  const query = `
    SELECT 
      taskassignments.tech_id, 
      COUNT(DISTINCT taskassignments.task_id) AS total_tasks
    FROM 
      taskassignments
    INNER JOIN 
      tasks ON taskassignments.task_id = tasks.task_id
    WHERE 
      taskassignments.tech_id = ? 
      AND tasks.status_id IN (2, 4, 5) 
      AND tasks.task_type_id IN (1, 12)
    GROUP BY 
      taskassignments.tech_id
  `;

  db.query(query, [tech_id], (error, results) => {
    if (error) {
      console.error("Error fetching task count:", error.message, error.stack);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // ถ้าไม่มี task ให้ return 0 แทน 404
    if (results.length === 0) {
      return res.json({
        tech_id: tech_id,
        total_tasks: 0,
      });
    }

    res.json({
      tech_id: results[0].tech_id,
      total_tasks: results[0].total_tasks,
    });
  });
});
router.put("/task/update-status/:id", (req, res) => {
  const taskId = req.params.id;
  const newStatusId = 2; // Set the new status_id to 2

  const query = `
    UPDATE tasks
    SET status_id = ?
    WHERE task_id = ?
  `;

  db.query(query, [newStatusId, taskId], (err, result) => {
    if (err) {
      console.error("Error updating status: ", err);
      return res.status(500).json({ error: "Failed to update task status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task_id: taskId,
      status_id: newStatusId,
    });
  });
});

router.get("/tasks/top3", (req, res) => {
  const query = `
    SELECT t.*, COUNT(ta.assignment_id) AS assignment_count, st.status_name, st.status_id
    FROM tasks t
    JOIN taskassignments ta ON t.task_id = ta.task_id
    JOIN status st ON t.status_id = st.status_id
    GROUP BY t.task_id
    ORDER BY assignment_count DESC
    LIMIT 3;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching top 3 tasks:", err);
      return res.status(500).json({ error: "Failed to fetch top 3 tasks" });
    }

    res.status(200).json({
      message: "Top 3 tasks based on assignments",
      tasks: result,
    });
  });
});

router.get("/tasks/top3/:user_id", (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT t.*, st.status_name, st.status_id
    FROM tasks t
    JOIN status st ON t.status_id = st.status_id
    WHERE t.user_id = ?
    ORDER BY t.updatedAt DESC
    LIMIT 3;
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error(`Error fetching top 3 recently updated tasks for user ${user_id}:`, err);
      return res.status(500).json({ error: "Failed to fetch top 3 recently updated tasks for the user" });
    }

    res.status(200).json({
      message: `Top 3 recently updated tasks for user ${user_id}`,
      tasks: result,
    });
  });
});

router.post("/v2/tasks", upload.array("images", 10), async (req, res) => {
  const {
    user_id,
    description,
    task_type_id,
    quantity_used = 0,
    address,
    appointment_date,
    latitude,
    longitude,
    rental_start_date,
    rental_end_date,
    organization_name, // ✅ เพิ่ม organization_name
  } = req.body;

  // ✅ ตรวจสอบค่า required (ถ้าต้องการให้ organization_name เป็น required ให้เพิ่มในเงื่อนไข)
  if (!user_id || !task_type_id || !address || !appointment_date) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const query = `
    INSERT INTO tasks 
    (user_id, description, task_type_id, quantity_used, address, appointment_date, latitude, longitude, isActive, organization_name) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      user_id,
      description || "",
      task_type_id,
      quantity_used,
      address,
      appointment_date,
      latitude || null,
      longitude || null,
      1,
      organization_name || null, // ✅ เพิ่ม organization_name (อนุญาตให้เป็น null ได้)
    ],
    async (err, result) => {
      if (err) {
        console.error("Error creating task:", err);
        return res.status(500).json({ error: "Failed to create task" });
      }

      const taskId = result.insertId;

      if (rental_start_date && rental_end_date) {
        const rentalQuery = `
          INSERT INTO rental (task_id, rental_start_date, rental_end_date) 
          VALUES (?, ?, ?)
        `;

        db.query(rentalQuery, [taskId, rental_start_date, rental_end_date], (err) => {
          if (err) {
            console.error("Error creating rental record:", err);
            return res.status(500).json({ error: "Failed to create rental record" });
          }
        });
      }

      try {
        const imageUrls = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, { folder: "task_images" });
          imageUrls.push(result.secure_url);
          fs.unlinkSync(file.path);
        }

        if (imageUrls.length > 0) {
          const imageQuery = "INSERT INTO task_images (task_id, image_url, uploaded_at) VALUES ?";
          const imageValues = imageUrls.map((url) => [taskId, url, new Date()]);

          db.query(imageQuery, [imageValues], (err) => {
            if (err) {
              console.error("Error saving task images:", err);
              return res.status(500).json({ error: "Failed to save task images" });
            }
          });
        }

        res.status(201).json({
          task_id: taskId,
          user_id,
          description,
          task_type_id,
          quantity_used,
          address,
          appointment_date,
          latitude,
          longitude,
          rental_start_date,
          rental_end_date,
          organization_name, // ✅ เพิ่มใน response
          images: imageUrls,
        });
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        return res.status(500).json({ error: "Failed to upload images." });
      }
    }
  );
});

router.get("/task_images/:task_id", (req, res) => {
  const { task_id } = req.params;

  db.query("SELECT * FROM task_images WHERE task_id = ?", [task_id], (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      return res.status(500).json({ error: "Failed to fetch images." });
    }
    res.json(results);
  });
});

router.post("/task_images", upload.single("image"), async (req, res) => {
  const { task_id } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded." });
  }

  try {
    // ✅ อัปโหลดรูปไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "task_images",
    });

    const imageUrl = result.secure_url;
    const uploaded_at = new Date();

    // ✅ บันทึกลง MySQL
    db.query(
      "INSERT INTO task_images (task_id, image_url, uploaded_at) VALUES (?, ?, ?)",
      [task_id, imageUrl, uploaded_at],
      (err, dbResult) => {
        if (err) {
          console.error("Error inserting image:", err);
          return res.status(500).json({ error: "Failed to save image." });
        }

        // ✅ ลบไฟล์ต้นฉบับออกจากเซิร์ฟเวอร์
        fs.unlinkSync(req.file.path);

        res.json({
          id: dbResult.insertId,
          task_id,
          image_url: imageUrl,
          uploaded_at,
        });
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
});

router.put("/task_images/:image_id", (req, res) => {
  const { image_id } = req.params;
  const { task_id, image_url } = req.body; // รับข้อมูลใหม่จาก body

  // ตรวจสอบว่ามีข้อมูลที่ต้องอัปเดตไหม
  if (!task_id || !image_url) {
    return res.status(400).json({ error: "task_id and image_url are required." });
  }

  // คำสั่ง SQL สำหรับอัปเดตข้อมูล
  db.query(
    "UPDATE task_images SET task_id = ?, image_url = ? WHERE id = ?",
    [task_id, image_url, image_id],
    (err, result) => {
      if (err) {
        console.error("Error updating image:", err);
        return res.status(500).json({ error: "Failed to update image." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Image not found." });
      }

      res.json({ message: "Image updated successfully!" });
    }
  );
});

router.delete("/task_images/:image_id", (req, res) => {
  const { image_id } = req.params;

  // ดึง URL ของรูปจาก Database ก่อนเพื่อลบจาก Cloudinary
  db.query("SELECT image_url FROM task_images WHERE id = ?", [image_id], async (err, results) => {
    if (err) {
      console.error("Error fetching image:", err);
      return res.status(500).json({ error: "Failed to fetch image." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Image not found." });
    }

    const imageUrl = results[0].image_url;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // ดึง public_id ของ Cloudinary

    try {
      // ✅ ลบจาก Cloudinary
      await cloudinary.uploader.destroy(`task_images/${publicId}`);

      // ✅ ลบจาก Database
      db.query("DELETE FROM task_images WHERE id = ?", [image_id], (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting image:", deleteErr);
          return res.status(500).json({ error: "Failed to delete image." });
        }
        res.json({ message: "Image deleted successfully!" });
      });
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      res.status(500).json({ error: "Failed to delete image from Cloudinary." });
    }
  });
});

router.get("/rental/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  // SQL query to get rental and product data
  const query = `
    SELECT 
      r.task_id,
      p.product_id,
      p.name AS product_name,
      SUM(r.quantity) AS total_quantity_used
    FROM rental r
    JOIN products p ON r.product_id = p.product_id
    WHERE r.task_id = ?
    GROUP BY r.task_id, r.product_id, p.name;
  `;

  // Query execution
  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching rental data: ", err);
      return res.status(500).json({ error: "Failed to fetch rental data" });
    }

    // Return the result
    res.status(200).json({
      rentalData: result
    });
  });
});

router.get("/rentals", (req, res) => {
  const query = `
    SELECT 
      r.task_id,
      r.product_id,
      COALESCE(p.name, 'Unknown Product') AS product_name,
      SUM(r.quantity) AS total_quantity_used,
      MIN(r.rental_start_date) AS rental_start_date,
      MAX(r.rental_end_date) AS rental_end_date,
      AVG(r.price) AS average_price,         -- ค่าเฉลี่ยของ price
      SUM(r.amount) AS total_amount          -- ยอดรวมของ amount
    FROM rental r
    LEFT JOIN products p ON r.product_id = p.product_id
    GROUP BY r.task_id, r.product_id;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching rental data: ", err);
      return res.status(500).json({ error: "Failed to fetch rental data" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "No rental data found" });
    }
    res.status(200).json({ rentalData: result });
  });
});

router.put("/v2/tasks/complete/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // อัปเดตสถานะของ task ในตาราง tasks เป็น 'complete' (สมมติว่า status_id = 5 คือสถานะ "เสร็จสมบูรณ์")
    const completeTaskQuery = `
      UPDATE tasks
      SET status_id = 2
      WHERE task_id = ?
    `;

    db.query(completeTaskQuery, [taskId], (err, result) => {
      if (err) {
        console.error("Error completing task:", err);
        return res.status(500).json({ error: "Error completing task" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      // ส่งข้อความตอบกลับว่า task ถูกเปลี่ยนสถานะเป็นเสร็จสมบูรณ์แล้ว
      res.status(200).json({ message: "Task status updated to complete" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/v3/tasks/paged", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 items per page
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      tasks.*, 
      users.username,
      users.firstname,
      users.lastname,
      users.phone,
      tasktypes.type_name,
      status.status_name,
      GROUP_CONCAT(DISTINCT rental.product_id ORDER BY rental.product_id ASC) AS rental_product_ids,
      GROUP_CONCAT(DISTINCT rental.rental_start_date ORDER BY rental.product_id ASC) AS rental_start_dates,
      GROUP_CONCAT(DISTINCT rental.rental_end_date ORDER BY rental.product_id ASC) AS rental_end_dates,
      GROUP_CONCAT(DISTINCT taskassignments.tech_id ORDER BY taskassignments.tech_id ASC) AS tech_ids
    FROM 
      tasks 
    INNER JOIN 
      users ON tasks.user_id = users.user_id
    INNER JOIN 
      status ON tasks.status_id = status.status_id
    INNER JOIN 
      tasktypes ON tasks.task_type_id = tasktypes.task_type_id
    LEFT JOIN 
      rental ON tasks.task_id = rental.task_id
    LEFT JOIN 
      taskassignments ON tasks.task_id = taskassignments.task_id
    WHERE 
      tasks.isActive = 1 
      AND (tasks.task_type_id = 1 OR tasks.task_type_id = 12)
    GROUP BY 
      tasks.task_id
    LIMIT ? OFFSET ?;
  `;

  const countQuery = `
    SELECT COUNT(DISTINCT tasks.task_id) AS total 
    FROM tasks 
    WHERE tasks.isActive = 1 
      AND (tasks.task_type_id = 1 OR tasks.task_type_id = 12)
  `;

  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error counting tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks count" });
    }

    const total = countResult[0].total;

    db.query(query, [parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) {
        console.error("Error fetching paged tasks: ", err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
      }

      res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        tasks: result,
      });
    });
  });
});

module.exports = router;
