import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BackButtonEdit from "../../components/BackButtonEdit";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const translations = {
  en: {
    forgotPassword: "Forgot Password",
    emailLabel: "Enter your email",
    emailPlaceholder: "Email",
    submitButton: "Send Reset Link",
    successMessage: "A password reset link has been sent to your email!",
    errorMessage: "Error!",
    emailNotFound: "Email not found.",
    serverError: "Failed to send reset link. Please try again.",
  },
  th: {
    forgotPassword: "ลืมรหัสผ่าน",
    emailLabel: "กรอกอีเมลของคุณ",
    emailPlaceholder: "อีเมล",
    submitButton: "ส่งลิงก์รีเซ็ต",
    successMessage: "ลิงก์รีเซ็ตรหัสผ่านถูกส่งไปยังอีเมลของคุณแล้ว!",
    errorMessage: "ข้อผิดพลาด!",
    emailNotFound: "ไม่พบอีเมลนี้",
    serverError: "ไม่สามารถส่งลิงก์รีเซ็ตได้ กรุณาลองใหม่",
  },
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );
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
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/forgot-password`,
        {
          email,
        }
      );
      Swal.fire("Success", t.successMessage, "success");
      navigate("/login"); // กลับไปหน้า login หลังจากส่งลิงก์สำเร็จ
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Swal.fire(t.errorMessage, t.emailNotFound, "error");
      } else {
        Swal.fire(t.errorMessage, t.serverError, "error");
      }
      console.error("Error sending reset link:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8 min-h-screen flex items-center justify-center font-prompt">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="flex  w-full my-2">
            <BackButtonEdit />
            <h1 className="text-2xl font-semibold mx-2">{t.forgotPassword}</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">{t.emailLabel}</label>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
