const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const isAdmin = require('../middlewares/isAdmin');
require("dotenv").config();

const EMAIL_USER =  process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/applicant-image");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/applicants", (req, res) => {
  const query = "SELECT * FROM  technician_applicants WHERE status_id = 1";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching applicants: " + err);
      res.status(500).json({ error: "Failed to fetch applicants" });
    } else {
      res.json(result);
    }
  });
});

router.get("/applicants/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT *FROM technician_applicants WHERE  applicant_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching applicant" + err);
      res.status(500).json({ error: "Failed to fetch applicant" });
    } else {
      res.json(result);
    }
  });
});

router.post(
  "/applicants",
  upload.fields([
    { name: "id_card_image" },
    { name: "driver_license_image" },
    { name: "criminal_record_image" },
    { name: "additional_image" },
  ]),
  async (req, res) => {
    const {
      date_of_birth,
      address,
      email,
      phone_number,
      position_applied,
      notes,
      interview_date,
      interviewer,
      first_name,
      last_name,
      status_id,
    } = req.body;

    try {
      const imageUploadPromises = [];
      const imageUrls = [];

      if (req.files) {
        for (const key of Object.keys(req.files)) {
          const imagePath = req.files[key][0].path;

          const compressedImagePath = path.join(
            __dirname,
            `compressed-${req.files[key][0].filename}`
          );
          await sharp(imagePath).resize(800).toFile(compressedImagePath);

          const result = await cloudinary.uploader.upload(compressedImagePath, {
            folder: "image/applicant-images",
          });

          imageUrls.push(result.secure_url);

          fs.unlinkSync(compressedImagePath);
        }
      }

      const query = `INSERT INTO technician_applicants (date_of_birth, address, email, phone_number, position_applied, notes, interview_date, interviewer, first_name, last_name, status_id, id_card_image_url, driver_license_image_url, criminal_record_image_url, additional_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

      db.query(
        query,
        [
          date_of_birth,
          address,
          email,
          phone_number,
          position_applied,
          notes,
          interview_date,
          interviewer,
          first_name,
          last_name,
          1,
          imageUrls[0] || null,
          imageUrls[1] || null,
          imageUrls[2] || null,
          imageUrls[3] || null,
        ],
        (err, result) => {
          if (err) {
            console.error("Error creating applicant:", err);
            return res
              .status(500)
              .json({ error: "Failed to create applicant." });
          }
          res
            .status(201)
            .json({
              message: "Applicant created successfully",
              applicantId: result.insertId,
            });
        }
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ error: "Failed to upload images." });
    }
  }
);

router.post("/applicant-email/:id", async (req, res) => {
  const id = req.params.id;
  const applicantQuery =
    "SELECT * FROM technician_applicants WHERE applicant_id = ?";

  db.query(applicantQuery, [id], (err, result) => {
    if (err) {
      console.error("Failed to send email " + err);
      return res.status(500).send("Failed to send email");
    }

    const applicants = result.map((row) => {
      return {
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
      };
    });
    const applicant = applicants[0];

    const mailOptions = {
      from: "kookkaball68@gmail.com",
      to: applicant.email,
      subject: "สถานะการสมัครงานของคุณ",
      text: `สวัสดี ${applicant.first_name} ${applicant.last_name},\n\nขอบคุณที่สมัครงานกับเรา!\n\nขอบคุณ!`,
    };

    transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Send email success" });
  });
});

router.put(
  "/applicants/:id",
  upload.fields([
    { name: "id_card_image" },
    { name: "driver_license_image" },
    { name: "criminal_record_image" },
    { name: "additional_image" },
  ]),
  async (req, res) => {
    const id = req.params.id;
    const {
      date_of_birth,
      address,
      email,
      phone_number,
      position_applied,
      notes,
      interview_date,
      interviewer,
      first_name,
      last_name,
      status_id,
    } = req.body;

    try {
      const imageUploadPromises = [];
      const imageUrls = [];

      if (req.files) {
        for (const key of Object.keys(req.files)) {
          const imagePath = req.files[key][0].path;

          const compressedImagePath = path.join(
            __dirname,
            `compressed-${req.files[key][0].filename}`
          );
          await sharp(imagePath).resize(800).toFile(compressedImagePath);

          const result = await cloudinary.uploader.upload(compressedImagePath, {
            folder: "image/applicant-images",
          });

          imageUrls.push(result.secure_url);

          fs.unlinkSync(imagePath);
          fs.unlinkSync(compressedImagePath);
        }
      }

      const query = `UPDATE technician_applicants SET date_of_birth = ?, address = ?, email = ?, phone_number = ?, position_applied = ?, notes = ?, interview_date = ?, interviewer = ?, first_name = ?, last_name = ?, status_id = ?, id_card_image_url = ?, driver_license_image_url = ?, criminal_record_image_url = ?, additional_image_url = ? WHERE applicant_id = ?`;

      db.query(
        query,
        [
          date_of_birth,
          address,
          email,
          phone_number,
          position_applied,
          notes,
          interview_date,
          interviewer,
          first_name,
          last_name,
          status_id,
          imageUrls[0] || null,
          imageUrls[1] || null,
          imageUrls[2] || null,
          imageUrls[3] || null,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating applicant:", err);
            return res
              .status(500)
              .json({ error: "Failed to update applicant." });
          }
          res.json({ message: "Applicant updated successfully." });
        }
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ error: "Failed to upload images." });
    }
  }
);

router.delete("/applicants/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM technician_applicants WHERE applicant_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting applicant:", err);
      res.status(500).json({ error: "Failed to delete applicant" });
    } else {
      res.json({ message: "Applicant deleted successfully" });
    }
  });
});


router.post("/applicants/accept/:id", (req, res) => {
  const id = req.params.id;
  const query = "UPDATE technician_applicants SET status_id = ? WHERE applicant_id = ?";

  db.query(query, [7, id], (err, result) => {
    if (err) {
      console.error("Error accepting applicant:", err);
      return res.status(500).json({ error: "Failed to accept applicant" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Applicant not found" });
    }
    res.json({ message: "Applicant accepted successfully" });
  });
});

module.exports = router;
