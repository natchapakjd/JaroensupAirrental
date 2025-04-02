import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const translations = {
  en: {
    resetPassword: "Reset Password",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter new password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Confirm new password",
    submitButton: "Reset Password",
    successMessage: "Password reset successfully!",
    errorMessage: "Error!",
    passwordMismatch: "Passwords do not match.",
    invalidToken: "Invalid or expired token.",
    serverError: "Failed to reset password. Please try again.",
  },
  th: {
    resetPassword: "รีเซ็ตรหัสผ่าน",
    newPasswordLabel: "รหัสผ่านใหม่",
    newPasswordPlaceholder: "กรอกรหัสผ่านใหม่",
    confirmPasswordLabel: "ยืนยันรหัสผ่าน",
    confirmPasswordPlaceholder: "ยืนยันรหัสผ่านใหม่",
    submitButton: "รีเซ็ตรหัสผ่าน",
    successMessage: "รีเซ็ตรหัสผ่านสำเร็จ!",
    errorMessage: "ข้อผิดพลาด!",
    passwordMismatch: "รหัสผ่านไม่ตรงกัน",
    invalidToken: "โทเค็นไม่ถูกต้องหรือหมดอายุ",
    serverError: "ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่",
  },
};

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLanguage = localStorage.getItem("language") || "th";
      if (currentLanguage !== language) {
        setLanguage(currentLanguage);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [language]);

  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire(t.errorMessage, t.passwordMismatch, "error");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/reset-password`, {
        token,
        newPassword,
      });
      Swal.fire("Success", t.successMessage, "success");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire(t.errorMessage, t.invalidToken, "error");
      } else {
        Swal.fire(t.errorMessage, t.serverError, "error");
      }
      console.error("Error resetting password:", error);
    }
  };

  return (
    <>
    <Navbar/>
     <div className="container mx-auto p-8 min-h-screen flex items-center justify-center font-prompt">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">{t.resetPassword}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">{t.newPasswordLabel}</label>
            <input
              type="password"
              placeholder={t.newPasswordPlaceholder}
              className="input input-bordered w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">{t.confirmPasswordLabel}</label>
            <input
              type="password"
              placeholder={t.confirmPasswordPlaceholder}
              className="input input-bordered w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn bg-blue text-white w-full hover:bg-blue"
          >
            {t.submitButton}
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ResetPassword;