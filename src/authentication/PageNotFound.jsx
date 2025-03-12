import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import Cookies from "universal-cookie";

const translations = {
  th: {
    notFound: "ไม่พบหน้านี้",
    message: "หน้าที่คุณกำลังมองหาอาจถูกลบหรือไม่สามารถใช้งานได้ชั่วคราว",
    goHome: "กลับหน้าหลัก",
  },
  en: {
    notFound: "Page Not Found",
    message: "The page you are looking for might have been removed or is temporarily unavailable.",
    goHome: "Go to Home",
  },
};

const PageNotFound = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
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
    <div className="flex items-center justify-center min-h-screen bg-white font-prompt">
      <div className="text-center p-6 bg-white shadow-md rounded-lg w-full max-w-md">
        <div className="text-6xl font-bold text-gray-600 mb-4">404</div>
        <div className="text-2xl font-semibold text-gray-800 mb-4">
          {translations[language].notFound}
        </div>
        <div className="text-gray-600 mb-6">{translations[language].message}</div>
        <button
          onClick={handleGoHome} // เปลี่ยนจาก <a> เป็น <button> และใช้ onClick
          className="bg-blue text-white px-4 py-2 rounded-md shadow-md hover:bg-blue transition"
        >
          {translations[language].goHome}
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;