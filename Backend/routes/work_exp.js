// routes/work_experience.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../cloundinary-config");

const storage = multer.diskStorage({
  destination: "uploads/work_experiences",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 📌 สร้างผลงานใหม่
router.post("/work_exps", (req, res) => {
  const { company_name, project_title, description } = req.body;

  const query = `
    INSERT INTO work_experiences (company_name, project_title, description)
    VALUES (?, ?, ?)
  `;

  db.query(query, [company_name, project_title, description], (err, result) => {
    if (err) return res.status(500).json({ error: "Create failed." });
    res.json({ id: result.insertId });
  });
});

router.put("/work_exps/:id", (req, res) => {
  const { id } = req.params;
  const { company_name, project_title, description } = req.body;

  const query = `
    UPDATE work_experiences
    SET company_name = ?, project_title = ?, description = ?
    WHERE id = ?
  `;

  db.query(query, [company_name, project_title, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Update failed." });
    res.json({ message: "Work experience updated successfully." });
  });
});

// 📌 อัปโหลดภาพผลงาน
router.post("/work_exps/images", upload.array("images"), async (req, res) => {
    const { work_experience_id } = req.body;
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }
  
    try {
      const uploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "image/work_experiences",
        });
  
        fs.unlinkSync(file.path); // ลบไฟล์ local ที่อัปโหลดชั่วคราว
  
        return new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO work_experience_images (work_experience_id, image_url) VALUES (?, ?)`,
            [work_experience_id, result.secure_url],
            (err, dbResult) => {
              if (err) return reject(err);
              resolve({
                id: dbResult.insertId,
                image_url: result.secure_url,
              });
            }
          );
        });
      });
  
      const savedImages = await Promise.all(uploadPromises);
  
      res.json({
        work_experience_id,
        images: savedImages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Upload failed." });
    }
  });
  
// 📌 ดึงรายการทั้งหมดพร้อมภาพ
router.get("/work_exps", (req, res) => {
  const query = `
    SELECT we.*, GROUP_CONCAT(wei.image_url) as images
    FROM work_experiences we
    LEFT JOIN work_experience_images wei ON we.id = wei.work_experience_id
    GROUP BY we.id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: "Fetch failed." });

    const data = result.map((row) => ({
      ...row,
      images: row.images ? row.images.split(",") : [],
    }));

    res.json(data);
  });
});

// 📌 ดึงผลงานตามไอดี
router.get("/work_exps/:id", (req, res) => {
    const { id } = req.params;
  
    const query = `
      SELECT we.*, GROUP_CONCAT(wei.image_url) AS images
      FROM work_experiences we
      LEFT JOIN work_experience_images wei ON we.id = wei.work_experience_id
      WHERE we.id = ?
      GROUP BY we.id
    `;
  
    db.query(query, [id], (err, results) => {
      if (err || results.length === 0) return res.status(404).json({ error: "Work experience not found." });
  
      const workExp = results[0];
      workExp.images = workExp.images ? workExp.images.split(",") : [];
      res.json(workExp);
    });
  });
  
// 📌 ลบภาพ
router.delete("/work_exps/image/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT image_url FROM work_experience_images WHERE id = ?", [id], async (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: "Image not found." });

    const imageUrl = result[0].image_url;
    const publicId = imageUrl.split("/").pop().split(".")[0];

    try {
      await cloudinary.uploader.destroy(`image/work_experiences/${publicId}`);
      db.query("DELETE FROM work_experience_images WHERE id = ?", [id]);
      res.json({ message: "Image deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image." });
    }
  });
});

// 📌 ลบผลงานพร้อมลบภาพ
router.delete("/work_exps/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // ดึงข้อมูลภาพทั้งหมดที่เกี่ยวข้องกับ work experience
      const queryImages = "SELECT id, image_url FROM work_experience_images WHERE work_experience_id = ?";
      db.query(queryImages, [id], async (err, imageResults) => {
        if (err) return res.status(500).json({ error: "Failed to fetch images." });
  
        // ลบภาพจาก Cloudinary
        const deleteImagePromises = imageResults.map(async (image) => {
          const publicId = image.image_url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`image/work_experiences/${publicId}`);
        });
  
        await Promise.all(deleteImagePromises); // รอให้ลบภาพทั้งหมดเสร็จ
  
        // ลบข้อมูลในฐานข้อมูล
        const deleteQuery = "DELETE FROM work_experience_images WHERE work_experience_id = ?";
        db.query(deleteQuery, [id], (err) => {
          if (err) return res.status(500).json({ error: "Failed to delete images." });
  
          // ลบข้อมูล work experience
          const deleteWorkExpQuery = "DELETE FROM work_experiences WHERE id = ?";
          db.query(deleteWorkExpQuery, [id], (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete work experience." });
  
            res.json({ message: "Work experience and images deleted successfully." });
          });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete work experience." });
    }
  });
  

module.exports = router;
