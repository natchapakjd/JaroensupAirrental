const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 ชั่วโมง
    max: 5, // อนุญาตให้ลองผิดพลาดได้ 5 ครั้ง
    message: { error: "Too many failed login attempts. Try again in 1 hour." },
    standardHeaders: true, // ส่ง headers แสดงสถานะ rate limit
    legacyHeaders: false, // ไม่ใช้ headers เก่า
  });


module.exports = loginLimiter;
