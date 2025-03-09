
const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require('../cloundinary-config')

// 📌 ตั้งค่าอัปโหลดไฟล์ (Multer)
const storage = multer.diskStorage({
  destination: "uploads/area_images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 📌 (1) ดึงรายการรูปภาพของ `area_calculation_id`
router.get("/area_images/:area_calculation_id", (req, res) => {
  const { area_calculation_id } = req.params;

  db.query(
    "SELECT * FROM area_images WHERE area_calculation_id = ?",
    [area_calculation_id],
    (err, result) => {
      if (err) {
        console.error("Error fetching images:", err);
        return res.status(500).json({ error: "Failed to fetch images" });
      }
      res.json(result);
    }
  );
});


// 📌 (3) ลบรูปภาพ
router.delete("/area_images/:id", (req, res) => {
  const { id } = req.params;

  // ค้นหารูปภาพก่อนลบ
  db.query("SELECT image_url FROM area_images WHERE id = ?", [id], async (err, result) => {
    if (err) {
      console.error("Error finding image:", err);
      return res.status(500).json({ error: "Failed to find image." });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Image not found." });
    }

    const imageUrl = result[0].image_url;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // แยก publicId จาก URL

    try {
      // ✅ ลบจาก Cloudinary
      await cloudinary.uploader.destroy(`area_images/${publicId}`);

      // ✅ ลบจาก Database
      db.query("DELETE FROM area_images WHERE id = ?", [id], (err) => {
        if (err) {
          console.error("Error deleting image from DB:", err);
          return res.status(500).json({ error: "Failed to delete image." });
        }
        res.json({ message: "Image deleted successfully." });
      });
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      res.status(500).json({ error: "Failed to delete image from Cloudinary." });
    }
  });
});

router.post("/area_images", upload.single("image"), async (req, res) => {
  const { area_calculation_id } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded." });
  }

  try {
    // ✅ อัปโหลดไฟล์ไปยัง Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "area_images",
    });

    const imageUrl = result.secure_url;
    const uploaded_at = new Date();

    // ✅ บันทึกข้อมูลลง Database
    db.query(
      "INSERT INTO area_images (area_calculation_id, image_url, uploaded_at) VALUES (?, ?, ?)",
      [area_calculation_id, imageUrl, uploaded_at],
      (err, dbResult) => {
        if (err) {
          console.error("Error inserting image:", err);
          return res.status(500).json({ error: "Failed to save image." });
        }

        // ✅ ลบไฟล์ต้นฉบับออกจากเซิร์ฟเวอร์
        fs.unlinkSync(req.file.path);

        res.json({
          id: dbResult.insertId,
          area_calculation_id,
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

module.exports = router;
