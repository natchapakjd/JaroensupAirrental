const express = require("express");
const router = express.Router();
const db = require("../db");
const cron = require("node-cron");
const isAdmin = require('../middlewares/isAdmin');

cron.schedule("0 0 * * *", () => {
  const query = `
    DELETE FROM tasks 
    WHERE isActive = 1 AND updatedAt < NOW() - INTERVAL 1 DAY`;

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

  const query = "SELECT t.*,tt.type_name ,st.status_name,st.status_id FROM tasks t JOIN status st ON t.status_id = st.status_id JOIN tasktypes tt ON t.task_type_id = tt.task_type_id LIMIT ? OFFSET ?";

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
  const limit = parseInt(req.query.limit) || 10; 
  const page = parseInt(req.query.page) || 1; 
  const offset = (page - 1) * limit; 

  let query = "SELECT t.*,tt.type_name ,st.status_name FROM tasks t JOIN status st ON t.status_id = st.status_id JOIN tasktypes tt ON t.task_type_id = tt.task_type_id WHERE user_id = ?"; 
  const queryParams = [userId];

  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);
  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.error("Error fetching tasks: ", err);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }

    const countQuery = "SELECT COUNT(*) AS total FROM tasks WHERE user_id = ?";
    
    db.query(countQuery, [userId], (err, countResult) => {
      if (err) {
        console.error("Error fetching task count: ", err);
        return res.status(500).json({ error: "Failed to fetch task count" });
      }

      const totalTasks = countResult[0].total; 
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
      tasks.isActive = 1 and tasks.task_type_id  = 1
    LIMIT ? OFFSET ?;
  `;

  const countQuery = `SELECT COUNT(*) AS total FROM tasks WHERE task_type_id = 1 and isActive = 1`;

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

router.get("/task/:id", (req, res) => {
  const taskId = req.params.id;

  const query = `
    SELECT 
      tasks.*, 
      tasktypes.*,
      status.*,
      rental.*,
      users.firstname,
      users.lastname
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
      tasktypes.*,
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
  } = req.body;
  const query =
    "INSERT INTO tasks (user_id, description, task_type_id, quantity_used, address, appointment_date, latitude,longitude,isActive) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)";

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
      1
    ],
    (err, result) => {
      if (err) {
        console.error("Error creating task: " + err);
        return res.status(500).json({ error: "Failed to create task" });
      }

      const taskId = result.insertId;

      const rentalQuery =
        "INSERT INTO rental (task_id, rental_start_date, rental_end_date) VALUES (?, ?, ?)";

      db.query(
        rentalQuery,
        [taskId, rental_start_date, rental_end_date],
        (err) => {
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
          });
        }
      );
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
  } = req.body;
  console.log(req.body)
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
      status_id = ?
    WHERE task_id = ?`;

  db.query(
    updateTaskQuery,
    [
      user_id,
      description,
      task_type_id,
      quantity_used,
      address,
      appointment_date,
      latitude,
      longitude,
      status_id,
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
            [rental_start_date, rental_end_date, id],
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
                rental_start_date,
                rental_end_date,
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
            [id, rental_start_date, rental_end_date],
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
                rental_start_date,
                rental_end_date,
              });
            }
          );
        }
      });
    }
  );
});


router.delete("/task/:id",(req, res) => {
  const id = req.params.id;
  const query = "UPDATE tasks SET isActive = 0 WHERE task_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error updating task to deleted: " + err);
      res.status(500).json({ error: "Failed to mark task as deleted" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(204).send();
    }
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
      existingRentalDates.rental_start_date || new Date().toISOString().split('T')[0], // ใช้วันที่เดิมหรือวันที่ปัจจุบัน
      existingRentalDates.rental_end_date || new Date().toISOString().split('T')[0], // ใช้วันที่เดิมหรือวันที่ปัจจุบัน
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

      return res.status(200).json({ message: 'Rental data added successfully and quantities updated' });
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

      // 2. อัพเดตสถานะของ task ให้เป็น 2
      const updateStatusQuery = `
        UPDATE tasks 
        SET status_id = 2 
        WHERE task_id = ?
      `;
      db.query(updateStatusQuery, [taskId], (err, updateStatusResult) => {
        if (err) {
          console.error("Error updating task status:", err);
          return res.status(500).json({ message: 'Failed to update task status' });
        }

        // 3. คืนสินค้ากลับใน products และ warehouses ตามที่ระบุใน task_items
        taskItemsResult.forEach((taskItem) => {
          const { product_id, quantity } = taskItem;

          // 3.1 เพิ่ม stock_quantity ใน products
          const updateProductQuery = `
            UPDATE products 
            SET stock_quantity = stock_quantity + ? 
            WHERE product_id = ?
          `;
          db.query(updateProductQuery, [quantity, product_id]);

          // 3.2 เพิ่ม capacity ใน warehouses
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
          
          // 3.3 อัพเดต quantity ใน rental เป็น 0
          const updateRentalQuery = `
            UPDATE rental
            SET quantity = 0
            WHERE task_id = ? AND product_id = ?
          `;
          db.query(updateRentalQuery, [taskId, product_id]);
        });

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

router.get("/tasks/count/:user_id", (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT user_id, COUNT(*) AS total_tasks
    FROM tasks
    WHERE user_id = ?
    GROUP BY user_id
  `;

  db.query(query, [user_id], (error, results) => {
    if (error) {
      console.error("Error fetching task count:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user." });
    }

    res.json({
      user_id: results[0].user_id,
      total_tasks: results[0].total_tasks,
    });
  });
});


module.exports = router;
