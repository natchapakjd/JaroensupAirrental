// src/pages/Settings.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const translations = {
  th: {
    allowNotification: "อนุญาตให้ส่งข้อความแจ้งเตือนผ่าน LINE หรือไม่?",
    allow: "อนุญาต",
  },
  en: {
    allowNotification: "Allow notifications via LINE?",
    allow: "Allow",
  },
};

const Settings = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  // ✅ ใช้ Event Listener ฟังการเปลี่ยนแปลงของ localStorage (Real-time Update)
  useEffect(() => {
    const handleStorageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Navigate to line-profile page
  const goToLineProfile = () => {
    navigate("/line-profile");
  };

  return (
    <div>
      <Navbar />
      <div className=" mx-auto  font-prompt">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-lg font-bold">
            {translations[language].allowNotification}
          </h2>
          <div className="flex justify-center mt-4">
            <button
              onClick={goToLineProfile}
              className="btn btn-success text-white "
            >
              {translations[language].allow}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
