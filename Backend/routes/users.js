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
  const query = "SELECT u.*, gd.gender_name, r.role_name FROM users u JOIN gender gd ON u.gender_id = gd.gender_id JOIN roles r ON u.role_id = r.role_id WHERE user_id = ?";

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
      role_id:row.role_id,
      username: row.username,
      email: row.email,
      role: row.role,
      created_at: row.created_at,
      image_url: row.image_url,
      phone : row.phone,
      role: row.role_id,
      age: row.age,
      address: row.address,
      gender_id: row.gender_id,
      date_of_birth: row.date_of_birth,
      created_at: row.created_at,
      firstname: row.firstname,
      lastname: row.lastname,
      linetoken: row.linetoken,
      gender_name: row.gender_name,
      role_name: row.role_name
    };

    res.json(user);
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

router.put("/user/:id",upload.single("profile_image"), async (req, res) => {
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
    if (req.file) {
      const profileImage = req.file.path;

      const result = await cloudinary.uploader.upload(profileImage, {
        folder: "image/user-image",
      });

      imageUrl = result.secure_url;
    }

    const query = `
      UPDATE users
      SET firstname = ?, lastname = ?, email = ?, phone = ?, age = ?, address = ?, gender_id = ?, image_url = ?, date_of_birth = ?
      WHERE user_id = ?
    `;

    db.query(
      query,
      [
        firstname,
        lastname,
        email,
        phone,
        age,
        address,
        gender_id,
        imageUrl || null,
        date_of_birth,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error updating user: " + err);
          return res.status(500).json({ error: "Failed to update user" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully" });
      }
    );
  } catch (err) {
    console.error("Error processing user update:", err);
    res.status(500).json({ error: "Failed to process user update." });
  }
});

router.delete("/user/:id",(req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM users WHERE user_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user: " + err);
      res.status(500).json({ error: "Failed to delete user" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
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
