const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const nodemailer = require("nodemailer");
const EMAIL_USER =  process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const JWT_SECRET =process.env.JWT_SECRET;
const loginLimiter = require("../middlewares/limitLogin");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

router.post("/login",loginLimiter,async (req, res) => {
  const { username, password } = req.body;

  // Update the query to join with the technicians table
  const query = `
    SELECT u.*, t.tech_id
    FROM users u
    LEFT JOIN technicians t ON u.user_id = t.user_id
    WHERE u.username = ?
  `;

  db.query(query, [username], async (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.user_id, role: user.role_id, technicianId: user.tech_id }, // Include technicianId in token
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (hashingError) {
      console.error("Hashing error:", hashingError);
      return res.status(500).json({ error: "Hashing error" });
    }
  });
});


router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body)
  
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).json({ error: "Database error" });
        }
  
        if (results.length > 0) {
          return res.status(400).json({ error: "User already exists" });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);
  
        // Insert the user into the database
        db.query(
          "INSERT INTO users SET ?",
          { username: username,role_id : "1", password: hashedPassword, email: email,gender_id : 1},
          (error, results) => {
            if (error) {
              console.error("Database error:", error);
              return res.status(500).json({ error: "Database error" , results});
            }
            console.log("User registered:", results);
            res.json({ message: "User registered" }); 
          }
        );
      }
    );
  });

  router.post("/forgot-password", (req, res) => {
    const { email } = req.body;
  
    // ตรวจสอบว่าอีเมลมีอยู่ในระบบหรือไม่
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error querying user:", err);
        return res.status(500).json({ error: "Server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "Email not found" });
      }
  
      const user = results[0];
  
      const token = jwt.sign(
        { id: user.user_id, role: user.role_id, technicianId: user.tech_id }, 
        JWT_SECRET,
        { expiresIn: "1h" }
      ); 

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Failed to send email" });
        }
        res.status(200).json({ message: "Reset link sent to your email" });
      });
    });
  });

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const query = "SELECT * FROM users WHERE user_id = ?";
    db.query(query, [userId], async (err, results) => {
      if (err) {
        console.error("Error querying user:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateQuery = "UPDATE users SET password = ? WHERE user_id = ?";
      db.query(updateQuery, [hashedPassword, userId], (err, result) => {
        if (err) {
          console.error("Error updating password:", err);
          return res.status(500).json({ error: "Failed to reset password" });
        }
        res.status(200).json({ message: "Password reset successfully" });
      });
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
});
module.exports = router;