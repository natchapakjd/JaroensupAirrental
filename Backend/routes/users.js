const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const cloudinary = require("../cloundinary-config");
const fs = require("fs");
const isAdmin = require('../middlewares/isAdmin');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/user-image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/users-paging", (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
  const offset = (page - 1) * limit; // Calculate the offset

  // Query to get the total count of users
  const countQuery = "SELECT COUNT(*) as total FROM users";

  // Query to fetch the paginated data
  const dataQuery = `
    SELECT u.*, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    LIMIT ? OFFSET ?
  `;

  // Execute the count query
  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error("Error fetching user count: " + err);
      return res.status(500).send("Failed to fetch users");
    }

    const totalUsers = countResult[0].total;

    // Execute the data query
    db.query(dataQuery, [parseInt(limit), parseInt(offset)], (err, dataResult) => {
      if (err) {
        console.error("Error fetching users: " + err);
        return res.status(500).send("Failed to fetch users");
      }

      const users = dataResult.map((row) => {
        return {
          user_id: row.user_id,
          username: row.username,
          firstname: row.firstname,
          lastname: row.lastname,
          email: row.email,
          role: row.role,
          created_at: row.created_at,
          image_url: row.image_url,
          role_id: row.role_id,
          gender_id: row.gender_id,
          role_name: row.role_name,
        };
      });

      res.json({
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        users,
      });
    });
  });
});

router.get("/users", (req, res) => {
  const query = "SELECT u.*, r.role_name  FROM users u JOIN roles r ON u.role_id = r.role_id";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching users: " + err);
      return res.status(500).send("Failed to fetch users");
    }

    const users = result.map((row) => {
      return {
        user_id: row.user_id,
        username: row.username,
        firstname:row.firstname,
        lastname:row.lastname,
        email: row.email,
        role: row.role,
        created_at: row.created_at,
        image_url: row.image_url,
        role_id:row.role_id,
        gender_id: row.gender_id,
        role_name:row.role_name
      };
    });

    res.json(users);
  });
});
router.get("/user/:id", (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT u.*, gd.gender_name, r.role_name
    FROM users u
    JOIN gender gd ON u.gender_id = gd.gender_id
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.user_id = ?;
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching user: " + err);
      return res.status(500).json({ error: "Failed to fetch user" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const row = result[0];
    const user = {
      user_id: row.user_id,
      role_id: row.role_id,
      username: row.username,
      email: row.email,
      created_at: row.created_at,
      image_url: row.image_url,
      phone: row.phone,
      age: row.age,
      address: row.address,
      gender_id: row.gender_id,
      date_of_birth: row.date_of_birth,
      firstname: row.firstname,
      lastname: row.lastname,
      linetoken: row.linetoken,
      gender_name: row.gender_name,
      role_name: row.role_name,
    };

    // ตรวจสอบว่า role_id เท่ากับ 2 หรือไม่
    if (user.role_id === 2) {
      const technicianQuery = `
        SELECT *
        FROM technicians
        WHERE user_id = ?;
      `;

      db.query(technicianQuery, [id], (err, technicianResult) => {
        if (err) {
          console.error("Error fetching technician details: " + err);
          return res.status(500).json({ error: "Failed to fetch technician details" });
        }

        if (technicianResult.length > 0) {
          user.technician_details = technicianResult[0];
        }

        res.json(user);
      });
    } else {
      res.json(user);
    }
  });
});

router.post("/change-password", (req, res) => {
  const newPassword = req.body.newPassword;
  const user_id = req.body.user_id; // Expecting user_id instead of username

  const changePasswordQuery = "SELECT * FROM users WHERE user_id = ?";

  db.query(changePasswordQuery, [user_id], async (err, changePassResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Database error.' });
    }

    if (changePassResult.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedQuery = "UPDATE users SET password = ? WHERE user_id = ?";
      db.query(updatedQuery, [hashedPassword, user_id], (err, updatedResult) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Error updating password.' });
        }
        res.json(updatedResult);
      });
    } catch (hashError) {
      console.log(hashError);
      return res.status(500).json({ error: 'Error hashing password.' });
    }
  });
});

router.put("/user/:id", upload.single("profile_image"), async (req, res) => {
  const id = req.params.id;
  const {
    firstname,
    lastname,
    email,
    phone,
    age,
    address,
    gender_id,
    date_of_birth,
  } = req.body;

  let imageUrl = null;

  try {
    // ดึง date_of_birth ปัจจุบันจากฐานข้อมูล
    const getCurrentUserQuery = `
      SELECT date_of_birth 
      FROM users 
      WHERE user_id = ?
    `;

    db.query(getCurrentUserQuery, [id], async (err, results) => {
      if (err) {
        console.error("Error fetching current user data: " + err);
        return res.status(500).json({ error: "Failed to fetch user data" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // เก็บ date_of_birth เดิม
      const currentDateOfBirth = results[0].date_of_birth;

      // แปลง date_of_birth ให้อยู่ในรูปแบบ YYYY-MM-DD
      let finalDateOfBirth;
      if (date_of_birth !== undefined && date_of_birth !== null && date_of_birth !== "") {
        const parsedDate = new Date(date_of_birth);
        if (isNaN(parsedDate)) {
          return res.status(400).json({ error: "Invalid date_of_birth format" });
        }
        // แปลงเป็นรูปแบบ YYYY-MM-DD
        finalDateOfBirth = parsedDate.toISOString().split("T")[0];
      } else {
        finalDateOfBirth = currentDateOfBirth; // ใช้ค่าเดิมถ้าไม่ส่งมา
      }

      // Check if a new profile image is uploaded
      if (req.file) {
        const profileImage = req.file.path;
        const result = await cloudinary.uploader.upload(profileImage, {
          folder: "image/user-image",
        });
        imageUrl = result.secure_url;
      }

      // Build the query dynamically to only update image_url if a new image is provided
      let query = `
        UPDATE users
        SET firstname = ?, lastname = ?, email = ?, phone = ?, age = ?, address = ?, gender_id = ?, date_of_birth = ?
      `;
      const values = [
        firstname || null,
        lastname || null,
        email || null,
        phone || null,
        age || null,
        address || null,
        gender_id || null,
        finalDateOfBirth, // ใช้ finalDateOfBirth ที่แปลงแล้ว
      ];

      // If a new image is uploaded, include image_url in the update
      if (imageUrl) {
        query += `, image_url = ?`;
        values.push(imageUrl);
      }

      query += ` WHERE user_id = ?`;
      values.push(id);

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error updating user: " + err);
          return res.status(500).json({ error: "Failed to update user" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully" });
      });
    });
  } catch (err) {
    console.error("Error processing user update:", err);
    res.status(500).json({ error: "Failed to process user update." });
  }
});

router.delete("/user/:id", (req, res) => {
  const id = req.params.id;
  const queryTechnicians = "DELETE FROM technicians WHERE user_id = ?";
  const queryUsers = "DELETE FROM users WHERE user_id = ?";

  // เริ่ม transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction: " + err);
      return res.status(500).json({ error: "Failed to delete user" });
    }

    // ลบจากตาราง technicians ก่อน
    db.query(queryTechnicians, [id], (err, resultTech) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error deleting from technicians: " + err);
          res.status(500).json({ error: "Failed to delete technician data" });
        });
      }

      // ลบจากตาราง users
      db.query(queryUsers, [id], (err, resultUser) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error deleting from users: " + err);
            res.status(500).json({ error: "Failed to delete user" });
          });
        }

        if (resultUser.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: "User not found" });
          });
        }

        // ถ้าทุกอย่างสำเร็จ commit transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error committing transaction: " + err);
              res.status(500).json({ error: "Failed to complete deletion" });
            });
          }
          res.status(200).json({ 
            message: "User and technician data deleted successfully",
            techniciansDeleted: resultTech.affectedRows,
            usersDeleted: resultUser.affectedRows 
          });
        });
      });
    });
  });
});

router.post("/user",upload.single("profile_image"), async (req, res) => {
  const {
    username,
    firstname,
    lastname,
    email,
    phone,
    age,
    address,
    gender_id,
    password,
    date_of_birth,
    role_id,
  } = req.body;

  const profileImage = req.file ? req.file.path : null;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }


  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload to Cloudinary
    let imageUrl = null;
    if (profileImage) {
      const result = await cloudinary.uploader.upload(profileImage, {
        folder: "image/user-image",
      });
      imageUrl = result.secure_url;
    }

    const query = `
      INSERT INTO users (username, firstname, lastname, email, phone, age, address, gender_id, password, date_of_birth, image_url,role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    db.query(
      query,
      [
        username,
        firstname,
        lastname,
        email,
        phone,
        age,
        address,
        gender_id,
        hashedPassword,
        date_of_birth,
        imageUrl,
        role_id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding user: " + err);
          res.status(500).json({ error: "Failed to add user" });
        } else {
          res
            .status(201)
            .json({
              message: "User added successfully",
              userId: result.insertId,
            });
        }
      }
    );
  } catch (error) {
    console.error("Error processing user creation:", error);
    res.status(500).json({ error: "Failed to process user creation." });
  }
});


router.get('/genders', (req, res) => {
  const query = 'SELECT * FROM gender';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching gender:', err);
          res.status(500).json({ error: 'Failed to fetch gender' });
      } else {
          res.json(results);
      }
  });
});

router.get('/linetoken-tech/:id', (req, res) => {
  const id  = req.params.id;
  const query = 'SELECT u.linetoken FROM technicians t JOIN users u ON t.user_id = u.user_id  WHERE t.tech_id = ?';

  db.query(query, [id] ,(err, results) => {
      if (err) {
          console.error('Error fetching token:', err);
          res.status(500).json({ error: 'Failed to fetch token' });
      } else {
          res.json(results);
      }
  });
});



module.exports = router;
