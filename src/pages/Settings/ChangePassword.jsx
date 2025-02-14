import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useLocation } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';
import Cookies from 'universal-cookie';

// ✅ Object สำหรับแปลภาษา
const translations = {
  th: {
    title: "เปลี่ยนรหัสผ่าน",
    newPassword: "รหัสผ่านใหม่",
    confirmNewPassword: "ยืนยันรหัสผ่านใหม่",
    changePassword: "เปลี่ยนรหัสผ่าน",
    success: "เปลี่ยนรหัสผ่านสำเร็จ!",
    error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
    mismatch: "รหัสผ่านไม่ตรงกัน",
  },
  en: {
    title: "Change Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    changePassword: "Change Password",
    success: "Password changed successfully!",
    error: "Error changing password.",
    mismatch: "Passwords do not match.",
  },
};

const ChangePassword = () => {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation(); 
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const id = decodeToken.id;
  
  // ✅ โหลดค่าภาษาเริ่มต้นจาก localStorage
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  useEffect(() => {
    setUserId(id);
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };
    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: translations[language].error,
        text: translations[language].mismatch,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/change-password`, {
        user_id: userId,
        newPassword,
      });
      Swal.fire({
        title: translations[language].success,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: translations[language].error,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error(error);
    }
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-prompt">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">{translations[language].title}</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">{translations[language].newPassword}</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">{translations[language].confirmNewPassword}</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn bg-blue hover:bg-blue text-white w-full">
              {translations[language].changePassword}
            </button>
          </form>
        </div>
      </div>
      {!isDashboard && <Footer />}
    </>
  );
};

export default ChangePassword;
