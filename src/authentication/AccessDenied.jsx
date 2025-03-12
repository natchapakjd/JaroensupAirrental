import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import Cookies from "universal-cookie";
import Navbar from "../components/Navbar";
const translations = {
  th: {
    accessDenied: "ปฏิเสธการเข้าถึง",
    noPermission: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
    goHome: "กลับหน้าหลัก",
  },
  en: {
    accessDenied: "Access Denied",
    noPermission: "You do not have permission to access this page.",
    goHome: "Go to Home",
  },
};

const AccessDenied = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const role = decodeToken.role;

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  // ฟังก์ชันสำหรับจัดการการคลิกปุ่ม
  const handleGoHome = () => {
    if (role === 2 || role === 3) {
      navigate("/dashboard/home");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {role === 1 && <Navbar />}
      <div className="flex items-center justify-center min-h-screen bg-white font-prompt">
        <div className="text-center p-6 bg-white shadow-md rounded-lg w-full max-w-md">
          <div className="text-3xl font-bold text-red-600 mb-4">
            {translations[language].accessDenied}
          </div>
          <div className="text-gray-700 mb-6">
            {translations[language].noPermission}
          </div>
          <button
            onClick={handleGoHome} // เปลี่ยนจาก <a> เป็น <button> และใช้ onClick
            className="bg-blue text-white px-4 py-2 rounded-md shadow-md hover:bg-blue transition"
          >
            {translations[language].goHome}
          </button>
        </div>
      </div>
    </>
  );
};

export default AccessDenied;
