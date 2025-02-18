import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );

  useEffect(() => {
    // 🔥 เปลี่ยนธีมของเว็บ (เพิ่ม/ลบ class "dark" บน body)
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    // 🔥 บันทึกภาษาล่าสุดไว้ใน localStorage
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <div className="h-screen bg-white flex flex-col items-center p-10 font-prompt transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 ">
        ⚙️ {language === "th" ? "ตั้งค่า (Settings)" : "Settings"}
      </h1>
  
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-6xl transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          🔧 {language === "th" ? "การตั้งค่าทั่วไป" : "General Settings"}
        </h2>
        <div className="space-y-6 text-lg">
          {/* <div className="flex justify-between items-center">
            <span>🌙 {language === "th" ? "โหมดมืด (Dark Mode)" : "Dark Mode"}</span>
            <input
              type="checkbox"
              className="toggle toggle-lg toggle-primary"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
          </div> */}
          {/* <div className="flex justify-between items-center">
            <span>🔔 {language === "th" ? "แจ้งเตือนผ่านไลน์ (Notifications)" : "LINE Notifications"}</span>
            <input type="checkbox" className="toggle toggle-lg toggle-primary" />
          </div> */}
          <div className="flex justify-between items-center">
            <span>🌍 {language === "th" ? "เปลี่ยนภาษา (Language)" : "Language"}</span>
            <select
              className="select select-lg select-bordered w-40"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="th">🇹🇭 ไทย</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>
      </div>
  
      <button
        onClick={() => navigate("/")}
        className="mt-10 bg-blue-600 text-black text-xl font-semibold px-8 py-3 rounded-xl shadow-lg  transition duration-200"
      >
        🔙 {language === "th" ? "กลับหน้าหลัก" : "Back to Home"}
      </button>
    </div>
  );
  
};

export default Setting;
